export ZSH=~/.oh-my-zsh
#ZSH_THEME="robbyrussell"
ZSH_THEME="powerlevel9k/powerlevel9k"
#ZSH_THEME="agnoster"

DEFAULT_USER=$(whoami)

# plugins=(brew git osx docker git yarn z)

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
  # fast-syntax-highlighting
  # zsh-syntax-highlighting
  # zsh-autosuggestions
  # zsh-completions
  history-substring-search
  terraform
  z
)

source $ZSH/oh-my-zsh.sh
source /usr/local/share/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh
source /usr/local/opt/powerlevel9k/powerlevel9k.zsh-theme

# User with skull
user_with_skull() {
    echo -n "\ufb8a $(whoami)"
}
P9K_CUSTOM_USER="user_with_skull"
P9K_RBENV_PROMPT_ALWAYS_SHOW=true
P9K_GO_VERSION_PROMPT_ALWAYS_SHOW=true
P9K_PYTHON_VERSION_PROMPT_ALWAYS_SHOW=true
P9K_LEFT_PROMPT_ELEMENTS=(custom_user dir vcs)
P9K_RIGHT_PROMPT_ELEMENTS=(background_jobs docker_machine)
POWERLEVEL9K_MODE='nerdfont-complete'
