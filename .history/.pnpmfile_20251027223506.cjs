// pnpm configuration file
// Ensures consistent package installation

function readPackage(pkg, context) {
  // Ignore postinstall scripts during installation
  if (pkg.scripts && pkg.scripts.postinstall) {
    delete pkg.scripts.postinstall
  }
  
  return pkg
}

module.exports = {
  hooks: {
    readPackage
  }
}

