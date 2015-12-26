### Cron Job

This is currently a scheduled cron job on my local machine set to run once a day.

#### What it does

- Pings `GET trends/available` and returns all available towns in the United States that have trending topics and adds them to a queue. 
- Pings `GET trends/place` for each of the available towns in the queue, limiting the call to one town every 2 minutes to accomodate Twitter's rate limiting. Processing everything in the queue takes around 2 hours.
- Saves each trending topic (up to 50 per town) to a MongoDB stored on Mongolabs with the following information:

```
{
    "_id": {
        "$oid": "567c6fa6a28d95771fe274ad"
    },
    "trend_name": "#ChristmasEve",
    "tweet_volume": 261740,
    "location_name": "Austin",
    "woeid": 2357536,
    "url": "http://twitter.com/search?q=%23ChristmasEve",
    "created_at": {
        "$date": "2015-12-24T22:14:13.000Z"
    },
    "updated_at": {
        "$date": "2015-12-24T22:20:22.839Z"
    },
    "__v": 0
}
```

- Upon completion, it sends me an email to notify that it's done with the corresponding job statistics and any error logs.

#### Usage

- `git clone https://github.com/mks-greenfield/cron-job.git`
- `npm install`
- Create `config.js` in root directory and add the following:

```
CONSUMER_KEY='Twitter-CONSUMER-KEY'
CONSUMER_SECRET='Twitter-CONSUMER-SECRET'
ACCESS_TOKEN_KEY='Twitter-API-KEY'
ACCESS_TOKEN_SECRET='Twitter-API-SECRET'
MONGOLAB_URI='mongodb://<dbuser>:<dbpassword>@ds035503.mongolab.com:35503/db-name'
USER_PWD='gmail_pwd'
USER_EMAIL='address@gmail.com'
yahooAPPID='yahoo client ID (consumer key)'
```

- Edit cron job `env EDITOR=nano crontab -e`
- Add cron job to run this file: `/Users/path/to/cron-job/cron_js.js`
- List active cron jobs `crontab -l`

#### Using Nodemailer to send email

- Gmail by default may block you from sending email with Node.
- To unblock, you may need to [“Allow Less Secure Apps”](https://www.google.com/settings/security/lesssecureapps) in your Gmail account.
- You also may need to [“Allow access to your Google account”](https://accounts.google.com/DisplayUnlockCaptcha).

#### Environment variables and cron jobs

- Currently, cron jobs don't seem to like `process.env` variables. I haven't figured out a way to use those.

#### Resources

- Cron time checker: http://crontab.guru/

#### Debugging

node cron.js >> app/debug.log 2>&1

Once a minute.

```
*/1 * * * * /usr/local/bin/node /Users/psoshnin/Desktop/makersquare/greenfield/cron-job/cron.js >> /Users/psoshnin/Desktop/makersquare/greenfield/cron-job/app/debug.log 2>&1
```

Once every three hours.

```
1 */3 * * * /usr/local/bin/node /Users/psoshnin/Desktop/makersquare/greenfield/cron-job/cron.js >> /Users/psoshnin/Desktop/makersquare/greenfield/cron-job/app/debug.log 2>&1
```

### Resources

- Yahoo WOEID API: https://developer.yahoo.com/geo/geoplanet/guide/api-reference.html#api-place

