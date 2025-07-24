# .idx/dev.nix or dev.nix
{
pkgs}: {
  # Which nixpkgs channel to use.
  channel = "stable-24.11"; # or "unstable"
  # Use https://search.nixos.org/packages to find packages
  packages = [
    pkgs.nodejs_20
    pkgs.zulu
    pkgs.openssh # Add this line
  ];
  # ... rest of your configuration
}
