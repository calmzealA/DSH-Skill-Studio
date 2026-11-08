# Publish your index

No official market registration is required. After publishing a public Git
repository with the prebuilt `lib/` directory committed, generate a real index:

```
node scripts/generate-market.mjs --repository https://github.com/YOUR_NAME/dsh-skill-studio --commit YOUR_FULL_40_CHARACTER_COMMIT_SHA
```

Deploy the generated `market/index.json` to HTTPS static hosting. In DSH enable
Plugins → Experimental → Custom plugin index, then Discover → Add index source.
The generation script refuses a placeholder or invalid SHA. No public plugin
or index URL has been provisioned by this source archive.
