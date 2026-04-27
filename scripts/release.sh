#!/bin/bash

# Скрипт для релиза новой версии
# Использование: ./scripts/release.sh [patch|minor|major]

set -e

VERSION_TYPE=${1:-patch}

echo "=== Релиз новой версии ==="
echo "Тип версии: $VERSION_TYPE"
echo ""

# Увеличиваем версию в package.json
npm version $VERSION_TYPE --no-git-tag-version

# Получаем новую версию
VERSION=$(node -p "require('./package.json').version")

echo "Новая версия: $VERSION"

# Удаляем локальный и удалённый тег если существует
git tag -d v$VERSION 2>/dev/null || true
git push origin :refs/tags/v$VERSION 2>/dev/null || true

# Коммит и тег
git add package.json
git commit -m "chore: release v$VERSION" || true
git tag "v$VERSION"

echo ""
echo "✓ Версия $VERSION закоммичена и помечена тегом"
echo ""
echo "Для отправки выполните:"
echo "  git push && git push --tags"
