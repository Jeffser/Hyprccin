import subprocess
process = subprocess.Popen('pwd', shell=True)
process = subprocess.Popen('/usr/bin/pkexec cp $(pwd)/pfp /var/lib/AccountsService/icons/$USER && busctl call org.freedesktop.Accounts /org/freedesktop/Accounts/User$UID org.freedesktop.Accounts.User SetIconFile s "/var/lib/AccountsService/icons/$USER" && rm ./pfp', shell=True, stdout=subprocess.PIPE)
process.wait()