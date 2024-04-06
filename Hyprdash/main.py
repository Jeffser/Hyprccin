import os, json, re, subprocess, sys
from flask import Flask, render_template, jsonify, send_file, request
app = Flask(__name__)

os.chdir(sys.path[0])

data = {}
def loadFile():
    global data
    data["user"] = {"username": os.path.expandvars("$USER")}
    data["monitors"] = json.load(os.popen("/usr/bin/hyprctl monitors -j"))
    data["splash"] = os.popen("/usr/bin/hyprctl splash").read()
    data["version"] = json.load(os.popen("/usr/bin/hyprctl version -j"))
    data["system-info"] = os.popen("/usr/bin/hyprctl systeminfo").read()
    data["binds"] = json.load(os.popen("/usr/bin/hyprctl binds -j"))

    data["config"] = json.load(open("defaults.json"))
    for item in data["config"].items():
        data["config"][item[0]] = {"default": item[1], "value": item[1]}
    with open(os.path.expanduser("~/.config/hypr/hyprland.conf"), "r") as f:
        lines = f.read().splitlines()
        for c in data["config"].items():
            rawlines = lines.copy()
            c=list(c)
            c[0]=c[0].split(":")
            i = [i for i, item in enumerate(rawlines) if re.search(r'\b{}\s*{{'.format(re.escape(c[0][0])), item)]
            if len(i) == 0:
                continue
            rawlines = rawlines[i[0]:]
            if len(c[0]) == 3:
                i = [i for i, item in enumerate(rawlines) if re.search(r'\b{}\s*{{'.format(re.escape(c[0][1])), item)]
                if len(i) !=0: rawlines = rawlines[i[0]:]
            result = [item for i, item in enumerate(rawlines) if re.search(r'\b{}\s*='.format(re.escape(c[0][-1])), item)]
            if len(result) > 0:
                result = '='.join(result[0].split('=')[1:]).strip()
                data['config'][':'.join(c[0])]["value"] = result
    data["animations"] = []
    with open(os.path.expanduser("~/.config/hypr/hyprland.conf"), "r") as f:
        lines = f.read().splitlines()
        lines = lines[[i for i, item in enumerate(lines) if re.search(r'\banimations\s*{', item)][0]+1:]
        lines = lines[:[i for i, item in enumerate(lines) if re.search(r'\}\s*', item)][0]]
        for l in lines:
            l = l.strip().split("=")
            if l[0].strip() in ("animation", "bezier"):
                temp = l[1].strip().split(",")
                for i in range(len(temp)): temp[i] = temp[i].strip()
                data["animations"].append({"type": l[0].strip(), "values": temp})
            
    data["windowrules"] = []
    data["env"] = {}
    data["exec"] = []
    with open(os.path.expanduser("~/.config/hypr/hyprland.conf"), "r") as f:
        for line in f:
            if line.startswith("windowrulev2"):
                line = re.sub(r'\bwindowrulev2\s*=\s*', '', line).replace("\n", "").split(",")
                rule = {}
                for s in line:
                    if s.startswith("class:"): rule["class"] = s.replace("class:","")
                    elif s.startswith("title:"): rule["title"] = s.replace("title:","")
                    elif "rule" in rule: 
                        if "extra" in rule:
                            rule["extra"] += f",{s}"
                        else:
                            rule["extra"] = s
                    else: rule["rule"] = s
                data["windowrules"].append(rule)
            elif line.startswith("env"):
                line = re.sub(r'\benv\s*=\s*', '', line).replace("\n", "").split(",")
                env = {} 
                data["env"][line[0]] = ",".join(line[1:])
            elif line.startswith("exec"):
                if line.startswith("exec-once"):
                    data["exec"].append({"command": re.sub(r'\bexec-once\s*=\s*', '', line).replace("\n", ""), "once": True})
                else:
                    data["exec"].append({"command": re.sub(r'\bexec\s*=\s*', '', line).replace("\n", ""), "once": False})

def saveFile():
    lines = []
    session_stack=[]
    data
    previous_size=0
    for i, c in enumerate(data['config'].items()):
        c=list(c)
        c[0]=c[0].split(":")
        if c[0][0] not in session_stack:
            if i!=0:
                lines.append("}\n")
                if previous_size==3:
                    lines.append("\t}")
            session_stack = []
            session_stack.append(c[0][0])
            lines.append(f"{c[0][0]} {'{'}")
            if c[0][0] == "animations":
                for a in data['animations']:
                    lines.append(f"\t{a['type']}={','.join(a['values'])}")
        if len(c[0])==3:
            if c[0][1] not in session_stack:
                if len(session_stack) == 2:
                    lines.append("}")
                    session_stack.pop()
                session_stack.append(c[0][1])
                lines.append(f"\t{c[0][1]} {'{'}")
        if type(c[1]["value"]) is bool: c[1]["value"] = "true" if c[1]["value"] else "false"
        lines.append(("\t\t" if len(c[0]) == 3 else "\t") + f"{c[0][-1]}={c[1]['value'] if c[1]['value'] != 'None' else ''}")
        previous_size = len(c[0])
    lines.append("}")

    lines.append("\n# Monitors")
    for m in data['monitors']:
        lines.append(f"monitor={m['name']},{m['width']}x{m['height']}@{m['refreshRate']},{m['x']}x{m['y']},{m['scale']}")

    lines.append("\n# Environment variables")
    for v in data['env'].items():
        lines.append(f"env={','.join(v)}")
    lines.append("\n# Execute at start")
    for e in data['exec']:
        lines.append(("exec-once=" if e['once'] else "exec=") + e['command'])

    lines.append("\n# Window Rules")
    for r in data['windowrules']:
        lines.append(f"windowrulev2={r['rule']}" + (f",class:{r['class']}" if 'class' in r else "") + (f",title:{r['title']}" if 'title' in r else "") + (f",{r['extra']}" if 'extra' in r else ""))
    
    lines.append("\n# Binds")
    for b in data['binds']:
        line = f"bind{'l' if b['locked'] else ''}{'r' if b['release'] else ''}{'e' if b['repeat'] else ''}{'n' if b['non_consuming'] else ''}{'m' if b['mouse'] else ''}="
        if b['modmask']==64: line+="SUPER"
        elif b['modmask']==68: line+="SUPER_CTRL"
        elif b['modmask']==65: line+="SUPER_SHIFT"
        elif b['modmask']==72: line+="SUPER_ALT"
        elif b['modmask']==8: line+="ALT"
        if b['key'] == '': b['key'] = f"code:{b['keycode']}"
        line+=f",{b['key']},{b['dispatcher']},{b['arg']}" if b['dispatcher'] != "mouse" else f",{b['key']},{b['arg']}"
        lines.append(line)

    with open(os.path.expanduser("~/.config/hypr/hyprland.conf"), "w+") as f:
        for line in lines:
            f.write(f"{line}\n")
        



@app.route("/")
def index():
    return render_template("index.html")

@app.route("/request/data")
def getData():
    return jsonify(data)

@app.route("/request/pfp")
def getPfp():
    return send_file(os.popen("busctl get-property org.freedesktop.Accounts /org/freedesktop/Accounts/User$UID org.freedesktop.Accounts.User IconFile | grep -o '\".*\"' | tr -d '\"'").read().replace("\n", ""), mimetype='image/png')

@app.route("/send/test", methods=["POST"])
def test():
    a = request.json["config"]
    for change in request.json['config'].items():
        data['config'][change[0]]["value"] = change[1]
    saveFile()
    os.popen("hyprctl reload")
    return json.dumps({'success':True}), 200, {'ContentType':'application/json'} 

@app.route("/send/pfp", methods=["POST"])
def sendPfp():
    pfp = request.files['pfp']
    pfp.save("pfp")
    try:
        process = subprocess.Popen('/usr/bin/pkexec cp $(pwd)/pfp /var/lib/AccountsService/icons/$USER && busctl call org.freedesktop.Accounts /org/freedesktop/Accounts/User$UID org.freedesktop.Accounts.User SetIconFile s "/var/lib/AccountsService/icons/$USER" && rm ./pfp', shell=True, stdout=subprocess.PIPE)
        process.wait()
    except:
        return json.dumps({'success':False}), 500, {'ContentType':'application/json'} 
    return json.dumps({'success':True}), 200, {'ContentType':'application/json'} 

if __name__ == "__main__":
    loadFile()
    #saveFile()
    #os.popen("xdg-open http://localhost:5000")
    app.run()
