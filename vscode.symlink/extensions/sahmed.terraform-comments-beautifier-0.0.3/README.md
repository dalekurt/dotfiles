# terraform-comments-beautifier README

[![Release Status](https://vsmarketplacebadge.apphb.com/version-short/sahmed.terraform-comments-beautifier.svg)](https://marketplace.visualstudio.com/items?itemName=sahmed.terraform-comments-beautifier)

This extension beautifies comments in terraform files. Changes them from:

```hcl
# Terraform Version
terraform {
  required_version = ">= 0.11.0"
}
```

to:
```hcl
###################
# Terraform Version
###################
terraform {
  required_version = ">= 0.11.0"
}
```
## Features

Adds explorer menu, editor menu and a command to beautify the selected document.



