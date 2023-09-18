#!/usr/bin/env python

import os, json
title = os.popen("playerctl metadata title").read().replace(" - YouTube Music", "").replace(" - YouTube", "").replace("\n", "").replace('&', '&amp;')
print(json.dumps({"text": f"󰎈 {title}" if title != "" else ""}))
