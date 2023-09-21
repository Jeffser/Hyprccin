#!/usr/bin/env python

import os, json
title = os.popen("playerctl metadata title").read().replace(" - YouTube Music", "").replace(" - YouTube", "").replace("\n", "").replace('&', '&amp;')
status = os.popen("playerctl status").read().replace("\n", "") 
if status != "Playing" and title != "": title += f" - {status}"
print(json.dumps({"text": f"󰎈 {title}" if title != "" else ""}))
