# Hyprccin

## Screenie
![1701878337_grim](https://github.com/Jeffser/Hyprccin/assets/69224322/fb3c208c-4884-4e0b-bce5-471764a6ccd0)


# Features
- **GTK implementation!** Wofi, Waybar and more will follow your gtk theme
- **Easily modifiable** I didn't do anything too crazy, you can figure out the config files easily
- **Install script avaible** There's a script meant to be run once you install Arch, that way you can have a nice Hyprland session as soon as you install Arch

## Requirements for Script
- `git`
- `base-devel`

## Install Script

This script is meant to be run once you installed Arch, if you already have Hyprland installed just copy the dotfiles and make sure you have all the [packages](packages)

This script does the following:

1) Install `yay` if needed
2) Install [packages](packages)
3) Enable `Flathub` repository
4) Enable `sddm`
5) Enable `bluetooth`
6) Copy [.config](.config), [.bashrc](.bashrc) and [.local](.local)
7) Make `waybar` scripts and `.local/bin/*` executable
8) Creates default directories `xdg-user-dirs-update`
9) Applies AutoColor GTK theme
10) Removes minimize maximize and close buttons from apps
