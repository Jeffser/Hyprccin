#
# ~/.bashrc
#

# If not running interactively, don't do anything
[[ $- != *i* ]] && return

alias ls='ls --color=auto'
alias grep='grep --color=auto'

alias cs='
COLOR_INFO="\e[47;32m";
COLOR_RESET="\e[0m";
echo -e "${COLOR_INFO}pulsemixer${COLOR_RESET} Audio mixer and source selector
${COLOR_INFO}bluetoothctl${COLOR_RESET} Discover and connect bluetooth devices
${COLOR_INFO}nmtui-connect${COLOR_RESET} Discover and connect to wifi networks
${COLOR_INFO}cava${COLOR_RESET} Audio visualizer
${COLOR_INFO}nwg-look${COLOR_RESET} Modify GTK appearance settings via gui"'

PS1='[\u@\h \W]\$ '

eval "$(starship init bash)"
export EDITOR=nvim
export PATH=/sbin:/bin:/usr/local/sbin:/usr/local/bin:/usr/bin:/usr/sbin:/var/lib/flatpak/exports/bin:/usr/bin/site_perl:/usr/bin/vendor_perl:/usr/bin/core_perl:~/.local/bin
neofetch
