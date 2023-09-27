#!/bin/bash

echo "Welcome to my Hyprland installation script"
echo "Made by Jeffser"
if [ $(id -u) -eq "0" ]; then
	echo "Don't run this as root"
	exit
fi
cd ~
echo "Installing yay..."
git clone https://aur.archlinux.org/yay-git.git
cd yay-git/
makepkg -si
cd ~
echo "Installing required packages..."
yay -S hyprland kitty cava neofetch uwufetch ly waybar-hyprland hyprpaper swaylock-effects swayidle wofi wlogout mako thunar ttf-jetbrains-mono-nerd noto-fonts-emoji polkit-gnome python-requests starship swappy grim slurp pamixer gvfs bluez bluez-utils lxappearance xfce4-settings xdg-desktop-portal-hyprland
git clone https://github.com/jeffser/hyprland-dotfiles.git
echo "Copying config files..."
cp -i hyprland-dotfiles/config/* .config/
cp -i hyprland-dotfiles/bashrc .bashrc
echo "Making waybar scripts executable..."
sudo chmod u+x .config/waybar/scripts/*
echo "Enabling ly..."
sudo systemctl enable ly
echo "You can now restart your computer or manually start hyprland via \"Hyprland\""
