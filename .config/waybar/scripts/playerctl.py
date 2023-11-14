#!/usr/bin/env python

import os, json
title = os.popen("playerctl metadata title").read().replace(" - YouTube Music", "").replace(" - YouTube", "").replace("\n", "").replace('&', '&amp;')
status = os.popen("playerctl status").read().replace("\n", "") 
icons = {
    "Playing": "󰎈",
    "Paused": "󰏤"
}
if len(title) > 30: title = title[0:30] + "..."
print(json.dumps({"text": f"{icons[status]} {title}" if title != "" else ""}))
