#
# ~/.bashrc
#

# If not running interactively, don't do anything
[[ $- != *i* ]] && return

alias ls='ls --color=auto'
alias grep='grep --color=auto'
alias presentation-mode='hyprctl keyword monitor HDMI-A-1,1920x1080@60,0x0,1,mirror,eDP-1'

PS1='[\u@\h \W]\$ '

eval "$(starship init bash)"
export EDITOR=nvim
export PATH=/sbin:/bin:/usr/local/sbin:/usr/local/bin:/usr/bin:/usr/sbin:/var/lib/flatpak/exports/bin:/usr/bin/site_perl:/usr/bin/vendor_perl:/usr/bin/core_perl:~/.local/bin

# CUSTOM TERMINAL GREETER :3
terminal-greeter
