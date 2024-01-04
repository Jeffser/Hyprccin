#
# ~/.bashrc
#

# If not running interactively, don't do anything
[[ $- != *i* ]] && return

alias ls='ls --color=auto'
alias grep='grep --color=auto'

PS1='[\u@\h \W]\$ '

eval "$(starship init bash)"
export EDITOR=lvim
export PATH=/sbin:/bin:/usr/local/sbin:/usr/local/bin:/usr/bin:/usr/sbin:/var/lib/flatpak/exports/bin:/usr/bin/site_perl:/usr/bin/vendor_perl:/usr/bin/core_perl:~/.local/bin

# CUSTOM TERMINAL GREETER :3
clear
OS_NAME=$(cat /etc/*-release | grep PRETTY_NAME | cut -d '"' -f 2)
kitten icat --clear
kitten icat --place 15x15@2x1 ~/.face
echo -e "                \e[1;37mWelcome   \e[34m${USER^}!" | cut -c1-$COLUMNS
echo -e "                  \e[1;37mHostname: \e[36m${HOSTNAME^}" | cut -c1-$COLUMNS
echo -e "                  \e[1;37mDesktop:  \e[35m${XDG_CURRENT_DESKTOP^}" | cut -c1-$COLUMNS
echo -e "                  \e[1;37mDistro:   \e[32m${OS_NAME^}" | cut -c1-$COLUMNS
echo -e "                  \e[1;37mTerminal: \e[33m${TERM^}" | cut -c1-$COLUMNS
if [ "$(playerctl status 2>&1 | tr -d '\n')" != "No players found" ]; then
  echo -e "                  \e[1;37mPlaying:  \e[31m$(playerctl metadata title | sed -e 's/ - YouTube Music//; s/ - YouTube//; s/&/\&amp;/g; s/"/\\\"/g' | tr -d '\n')" | cut -c1-$(($COLUMNS + 12))
else
  echo
fi
