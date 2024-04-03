if [[ "$(tty)" == "/dev/tty1" ]]; then
	Hyprland >/dev/null
fi

if [ -n "$BASH_VERSION" ]; then
	# include .bashrc if it exists
	if [ -f "$HOME/.bashrc" ]; then
		. "$HOME/.bashrc"
	fi
fi
