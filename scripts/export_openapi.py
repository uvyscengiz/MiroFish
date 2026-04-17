"""Export the live Flask OpenAPI document to a file."""

from __future__ import annotations

import argparse
import json
from pathlib import Path

from app import create_app


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Export the MiroFish OpenAPI document.")
    parser.add_argument(
        "--output",
        default="openapi/openapi.json",
        help="Path to write the exported OpenAPI JSON file.",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    output_path = Path(args.output)
    output_path.parent.mkdir(parents=True, exist_ok=True)

    app = create_app()
    with app.test_client() as client:
        response = client.get("/openapi.json")
    if response.status_code != 200:
        raise RuntimeError(f"OpenAPI export failed with status {response.status_code}")

    payload = response.get_json()
    output_path.write_text(
        json.dumps(payload, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(f"Exported OpenAPI spec to {output_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
