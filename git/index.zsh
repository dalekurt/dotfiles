######################################
# aliases
######################################
# Use `hub` as our git wrapper:
#   http://defunkt.github.com/hub/
hub_path=$(which hub)
if (( $+commands[hub] ))
then
  alias git=$hub_path
fi

alias gs='gst'
# for all the rest, I just use oh-my-zsh git plugin aliases

# The rest of my fun git aliases
alias gl='git pull --prune'
alias glog="git log --graph --pretty=format:'%Cred%h%Creset %an: %s - %Creset %C(yellow)%d%Creset %Cgreen(%cr)%Creset' --abbrev-commit --date=relative"
alias gp='git push origin HEAD'

# Remove `+` and `-` from start of diff lines; just rely upon color.
alias gd='git diff --color | sed "s/^\([^-+ ]*\)[-+ ]/\\1/" | less -r'

# alias gc='git commit'
# alias gca='git commit -a'
# alias gco='git checkout'
# alias gcb='git copy-branch-name'
# alias gb='git branch'
# alias gs='git status -sb' # upgrade your git if -sb breaks for you. it's fun.
# alias gac='git add -A && git commit -m'

alias g="git"
alias ga="git add -A"
alias gs="git status -sb"
alias gf="git fetch"
alias gpu="git pull"
alias gp="git push"
alias gd="git diff | mate"
alias gc="git commit -v"
alias gca="git commit -v -a"
alias gac="git add -A && git commit -m"
alias gcl="git clone"
alias gb="git branch"
alias gba="git branch -a"
alias gco="git checkout"
alias glg='git log --date-order --all --graph --format="%C(green)%h%Creset %C(yellow)%an%Creset %C(blue bold)%ar%Creset %C(red bold)%d%Creset%s"'
alias glgg="git log —oneline —decorate —graph"
alias gdc="git difftool —cached"
alias ge='git-edit-new'
