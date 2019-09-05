export ZSH=~/.oh-my-zsh

ZSH_THEME="powerlevel9k/powerlevel9k"
DEFAULT_USER=$(whoami)

plugins=(
  aws
  # aws-vault
  # gcloud
  # dotfiles
  git
  git-flow
  gitfast
  brew
  history
  node
  npm
  kubectl
  dotenv
  docker
  docker-compose
  bundler
  rake
  ruby
  rbenv
  osx
  autojump
#   fast-syntax-highlighting
  # zsh-syntax-highlighting
  # zsh-autosuggestions
  # zsh-completions
  history-substring-search
  terraform
  z
)

source $ZSH/oh-my-zsh.sh
source /usr/local/share/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh
source /usr/local/share/zsh-autosuggestions/zsh-autosuggestions.zsh
source /usr/local/share/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh
source /usr/local/opt/powerlevel9k/powerlevel9k.zsh-theme
source "/usr/local/opt/kube-ps1/share/kube-ps1.sh"

fpath=(/usr/local/share/zsh-completions $fpath)

# Kube PS1
prompt_kube_ps1(){
   echo -n `kube_ps1`
}

# User with skull
user_with_skull() {
    echo -n "\ufb8a $(whoami)"
}
P9K_CUSTOM_USER="user_with_skull"
P9K_RBENV_PROMPT_ALWAYS_SHOW=true
P9K_GO_VERSION_PROMPT_ALWAYS_SHOW=true
P9K_PYTHON_VERSION_PROMPT_ALWAYS_SHOW=true
# P9K_LEFT_PROMPT_ELEMENTS=(kube_ps1 custom_user dir vcs)
P9K_RIGHT_PROMPT_ELEMENTS=(background_jobs battery)
POWERLEVEL9K_MODE='nerdfont-complete'

# 
POWERLEVEL9K_SHORTEN_DIR_LENGTH=2
POWERLEVEL9K_SHORTEN_STRATEGY="truncate_middle"
POWERLEVEL9K_LEFT_PROMPT_ELEMENTS=(kube_ps1 dir vcs)
POWERLEVEL9K_RIGHT_PROMPT_ELEMENTS=(status root_indicator background_jobs history time)
# POWERLEVEL9K_TIME_FORMAT="%D{\uf073 %d-%h}"
# POWERLEVEL9K_TIME_FORMAT="%D{\uf017 %H:%M \uf073 %d-%h}"

# POWERLEVEL9K_PROMPT_ON_NEWLINE=true
# POWERLEVEL9K_MULTILINE_FIRST_PROMPT_PREFIX=''
# POWERLEVEL9K_MULTILINE_LAST_PROMPT_PREFIX=' $ '
# POWERLEVEL9K_MULTILINE_FIRST_PROMPT_PREFIX="\n"
# POWERLEVEL9K_MULTILINE_SECOND_PROMPT_PREFIX="%K{black}%F{white} `date +%T` \uf017 %f%k%F{white}%f $ "

# POWERLEVEL9K_VCS_GIT_ICON='\uf09b'
# POWERLEVEL9K_OS_ICON_BACKGROUND="white"
# POWERLEVEL9K_OS_ICON_FOREGROUND="blue"
# POWERLEVEL9K_DIR_HOME_BACKGROUND="transparent"
# POWERLEVEL9K_DIR_HOME_FOREGROUND="blue"
# POWERLEVEL9K_DIR_HOME_SUBFOLDER_BACKGROUND="transparent"
# POWERLEVEL9K_DIR_HOME_SUBFOLDER_FOREGROUND="blue"
# POWERLEVEL9K_VCS_CLEAN_BACKGROUND="transparent"
# POWERLEVEL9K_VCS_UNTRACKED_BACKGROUND="transparent"
# POWERLEVEL9K_VCS_MODIFIED_BACKGROUND="transparent"
# POWERLEVEL9K_VCS_CLEAN_FOREGROUND="040"
# POWERLEVEL9K_VCS_UNTRACKED_FOREGROUND="red"
# POWERLEVEL9K_VCS_MODIFIED_FOREGROUND="yellow"
# POWERLEVEL9K_DIR_DEFAULT_BACKGROUND="transparent"
# POWERLEVEL9K_DIR_DEFAULT_FOREGROUND="blue"

# Uncomment the following line to use case-sensitive completion.
CASE_SENSITIVE="true"

# Uncomment the following line to use hyphen-insensitive completion. Case
# sensitive completion must be off. _ and - will be interchangeable.
# HYPHEN_INSENSITIVE="true"

# Uncomment the following line to disable bi-weekly auto-update checks.
# DISABLE_AUTO_UPDATE="true"

# Uncomment the following line to change how often to auto-update (in days).
# export UPDATE_ZSH_DAYS=13

# Uncomment the following line to disable colors in ls.
# DISABLE_LS_COLORS="true"

# Uncomment the following line to disable auto-setting terminal title.
# DISABLE_AUTO_TITLE="true"

# Uncomment the following line to enable command auto-correction.
# ENABLE_CORRECTION="true"

# Uncomment the following line to display red dots whilst waiting for completion.
COMPLETION_WAITING_DOTS="true"

# Uncomment the following line if you want to disable marking untracked files
# under VCS as dirty. This makes repository status check for large repositories
# much, much faster.
DISABLE_UNTRACKED_FILES_DIRTY="true"

# Uncomment the following line if you want to change the command execution time
# stamp shown in the history command output.
# The optional three formats: "mm/dd/yyyy"|"dd.mm.yyyy"|"yyyy-mm-dd"
# HIST_STAMPS="mm/dd/yyyy"

# Would you like to use another custom folder than $ZSH/custom?
# ZSH_CUSTOM=/path/to/new-custom-folder

# Which plugins would you like to load? (plugins can be found in ~/.oh-my-zsh/plugins/*)
# Custom plugins may be added to ~/.oh-my-zsh/custom/plugins/
# Example format: plugins=(rails git textmate ruby lighthouse)
# Add wisely, as too many plugins slow down shell startup.

source "/usr/local/opt/kube-ps1/share/kube-ps1.sh"
prompt_kube_ps1(){
   echo -n `kube_ps1`
}
