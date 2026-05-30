# Codex usage notes

Codex was the first AI agent tested with this design system workflow.

Tested workflow:

1. Connect Figma access in Codex.
2. Provide a Figma frame URL.
3. Provide the GitHub repository URL or local repository.
4. Ask Codex to compare the Figma frame against tokens, patterns and registry files.
5. Treat the output as design system review support.

Codex may clone the GitHub repository locally to inspect files, run scripts and compare source files.

This is expected and useful for project-level checks.

The reusable prompts in `prompts/figma/` should remain agent-agnostic.