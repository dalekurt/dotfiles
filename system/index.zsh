######################################
# _path
######################################
export PATH="./bin:/usr/local/bin:/usr/local/sbin:$ZSHDOT/bin:$PATH"

######################################
# env
######################################
export EDITOR='code'

# your code folder that we can `c [tab]` to
export PROJECTS=~/Workspaces

######################################
# keys
######################################
# Pipe my public key to my clipboard.
alias pubkey="more ~/.ssh/id_rsa.pub | pbcopy | echo '=> Public key copied to pasteboard.'"

# grc overides for ls
#   Made possible through contributions from generous benefactors like
#   `brew install coreutils`
if $(gls &>/dev/null)
then
  alias ls="gls -F --color"
  alias l="gls -lAh --color"
  alias ll="gls -l --color"
  alias la='gls -A --color'
fi

# GRC colorizes nifty unix tools all over the place
if (( $+commands[grc] )) && (( $+commands[brew] ))
then
  source `brew --prefix`/etc/grc.bashrc
fi
