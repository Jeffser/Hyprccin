# Hyprland-dotfiles

## Screenie
![swappy-20230917_191558](https://github.com/Jeffser/Hyprland-dotfiles/assets/69224322/b9a1010f-6d0e-4740-8511-ae96bdae5df1)

## Install Script

This script is meant to be run once you installed Arch, if you already have Hyprland installed just copy the dotfiles and make sure you have all the [packages](packages)

This script does the following:

1) Install `git` and `base-devel`
2) Install `yay`
3) Install [packages](packages)
4) Enable `Flathub`
5) Enable `ly` (terminal display manager)
6) Enable `bluetooth`
7) Copy [.config](.config) and [.bashrc](.bashrc)
8) Modify `.config/hypr/hyprland.conf` and `.config/waybar/config.jsonc` depending on device profile
9) Make `waybar` scripts and `.config/hypr/xdg-portal-hyprland` executable
10) Remove desktop entries I don't use
