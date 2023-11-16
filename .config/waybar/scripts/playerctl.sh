#!/bin/bash

title=$(playerctl metadata title | sed 's/ - YouTube Music//;s/ - YouTube//;s/&/\&amp;/g' | tr -d '\n')
status=$(playerctl status | tr -d '\n')

declare -A icons
icons["Playing"]="󰎈"
icons["Paused"]="󰏤"

if [ ${#title} -gt 30 ]; then
    title="${title:0:30}..."
fi

if [ ! -z "$title" ]; then
    echo ${icons[$status]} $title
fi
