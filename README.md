# Hyprland-dotfiles

## Screenie
![1700112805_grim](https://github.com/Jeffser/Hyprland-dotfiles/assets/69224322/26e1e34b-db50-41a5-9070-8030a334f4fd)

## Requirements for Script
- `git`
- `base-devel`

## Install Script

This script is meant to be run once you installed Arch, if you already have Hyprland installed just copy the dotfiles and make sure you have all the [packages](packages)

This script does the following:

1) Install `yay`
2) Install [packages](packages)
3) Enable `Flathub`
4) Enable `ly` (terminal display manager)
5) Enable `bluetooth`
6) Copy [.config](.config) and [.bashrc](.bashrc)
7) Make `waybar` scripts and `.config/hypr/xdg-portal-hyprland` executable
8) Remove desktop entries I don't use
9) Creates default directories `xdg-user-dirs-update`

## Notes

- `nvim` configurations are just [nvchad](https://github.com/NvChad/NvChad)
