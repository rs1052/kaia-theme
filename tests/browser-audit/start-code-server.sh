#!/bin/sh
set -eu

profile=/home/coder/.local/share/code-server
extensions="$profile/extensions"
workspace=/workspace
user_settings="$profile/User/settings.json"

mkdir -p "$profile/User" "$extensions" "$workspace"
if [ ! -f "$user_settings" ]; then
  cat > "$user_settings" <<'EOF'
{
  "workbench.colorTheme": "Kaia",
  "workbench.startupEditor": "none"
}
EOF
fi
chown -R coder:coder "$profile" "$workspace"

if [ ! -f "$profile/.kaia-browser-audit-ready" ]; then
  su -s /bin/sh coder -c "
    set -eu
    cp -R /fixture/. /workspace/
    git -C /workspace init -q
    git -C /workspace config user.name 'Kaia Audit'
    git -C /workspace config user.email 'kaia-audit@example.invalid'
    git -C /workspace add .
    git -C /workspace commit -qm 'Initial audit fixture'
    printf '\n// Deliberate working-tree change for Source Control.\n' >> /workspace/src/App.tsx
    printf 'Untracked local audit note.\n' > /workspace/audit-note.txt
    code-server --user-data-dir $profile --extensions-dir $extensions --install-extension /install/kaia-theme-vscode.vsix --force
    touch $profile/.kaia-browser-audit-ready
  "
fi

exec su -s /bin/sh coder -c "exec code-server --bind-addr 0.0.0.0:8080 --auth password --disable-telemetry --user-data-dir $profile --extensions-dir $extensions /workspace"
