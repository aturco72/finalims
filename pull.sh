git reset --hard HEAD
git pull origin main
git clean -f -d
curl -X POST "https://api.cloudflare.com/client/v4/zones/0b82e899272eb3ae304e2c98161c6a67/purge_cache" -H "Authorization: Bearer oaeEYljW_SzbgFx5HcI90Zxxacp4WvLbOXqcKCwv" -H "Content-Type:application/json" --data '{"purge_everything":true}'
