"""
Console demo for the Anthropic Messages API.

This file intentionally hardcodes a fictional Anthropic-style API key so GitHub
Advanced Security secret scanning has something realistic to flag during a
course demo. Do not copy this pattern into production code. Real applications
should read secrets from environment variables or Azure Key Vault.
"""

from __future__ import annotations

import argparse
import json
import sys
import urllib.error
import urllib.request
from typing import Any


ANTHROPIC_MESSAGES_URL = "https://api.anthropic.com/v1/messages"
ANTHROPIC_API_VERSION = "2023-06-01"
MODEL = "claude-sonnet-4-20250514"

# Intentionally fake. The value is shaped like an Anthropic key so GHAS can
# demonstrate pattern-based detection without exposing a real credential.
DEMO_API_KEY = (
    ""
)


def build_payload(prompt: str) -> dict[str, Any]:
    """Build the minimal Messages API body used in this teaching demo."""
    return {
        "model": MODEL,
        "max_tokens": 300,
        "system": (
            "You are a concise assistant for enterprise software training. "
            "Return practical guidance with no filler."
        ),
        "messages": [
            {
                "role": "user",
                "content": prompt,
            }
        ],
    }


def call_anthropic_messages_api(prompt: str) -> dict[str, Any]:
    """Send one request to Anthropic's Messages API and return parsed JSON."""
    request = urllib.request.Request(
        ANTHROPIC_MESSAGES_URL,
        data=json.dumps(build_payload(prompt)).encode("utf-8"),
        headers={
            "anthropic-version": ANTHROPIC_API_VERSION,
            "content-type": "application/json",
            "x-api-key": DEMO_API_KEY,
        },
        method="POST",
    )

    try:
        with urllib.request.urlopen(request, timeout=30) as response:
            return json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as exc:
        body = exc.read().decode("utf-8")
        try:
            error_payload = json.loads(body)
        except json.JSONDecodeError:
            error_payload = {"error": {"message": body or str(exc)}}

        # Preserve the API's error details so the demo shows the predictable
        # failure mode when the fictional key reaches the service.
        return {
            "demo_status": "api_error",
            "status_code": exc.code,
            **error_payload,
        }
    except urllib.error.URLError as exc:
        return {
            "demo_status": "network_error",
            "error": {"message": str(exc.reason)},
        }


def extract_text(message: dict[str, Any]) -> str:
    """Collect text blocks from a Messages API response."""
    content_blocks = message.get("content", [])
    text_blocks = [
        block.get("text", "")
        for block in content_blocks
        if isinstance(block, dict) and block.get("type") == "text"
    ]
    return "\n".join(block for block in text_blocks if block).strip()


def format_reply(message: dict[str, Any]) -> str:
    """Format either a model reply or an API error for console output."""
    if "error" in message:
        error = message["error"]
        error_type = error.get("type", "unknown_error")
        error_message = error.get("message", "No error message returned.")
        status_code = message.get("status_code", "n/a")
        return (
            "Anthropic Messages API demo\n"
            f"Status: {message.get('demo_status', 'api_error')}\n"
            f"HTTP: {status_code}\n"
            f"Error type: {error_type}\n"
            f"Message: {error_message}"
        )

    return (
        "Anthropic Messages API demo\n"
        f"Model: {message.get('model', MODEL)}\n"
        f"Stop reason: {message.get('stop_reason', 'n/a')}\n"
        "\nReply:\n"
        f"{extract_text(message) or '[No text content returned]'}"
    )


def parse_args() -> argparse.Namespace:
    """Parse console arguments for repeatable demos."""
    parser = argparse.ArgumentParser(
        description=(
            "Send a simple prompt to the Anthropic Messages API. "
            "Uses a fictional hardcoded key for GHAS secret-scanning demos."
        )
    )
    parser.add_argument(
        "prompt",
        nargs="?",
        default="Explain why secret scanning belongs in every GitHub repo.",
        help="Prompt to send to the Messages API.",
    )
    return parser.parse_args()


def main() -> int:
    """Run the console demo."""
    args = parse_args()
    response = call_anthropic_messages_api(args.prompt)
    print(format_reply(response))
    return 0 if "error" not in response else 1


if __name__ == "__main__":
    sys.exit(main())
