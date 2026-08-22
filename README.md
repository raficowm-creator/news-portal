# News Portal

Next.js 14 news site with a full homepage and admin CMS.

Repo: https://github.com/raficowm-creator/news-portal

## After pull

```bash
npm install
cp .env.example .env
npx prisma db push
npx prisma db seed
npm run dev
```

Admin: `admin@example.com` / `admin123`

## Homepage features

1. Breaking news ticker (`react-fast-marquee`) — mark articles **Breaking** in admin
2. Featured slider (`embla-carousel-react`) — mark **Featured**
3. Trending sidebar — `viewCount` increments on article view
4. Category tabs — `/api/articles?category=`
5. Latest news grid with thumbnail, date, badge, author
6. Newsletter signup — `Subscriber` model
7. Social links — Admin → Settings
8. Dark mode toggle in header (`next-themes`)
9. Header search with autosuggest
10. Popular tags
11. Weather widget — set `OPENWEATHER_API_KEY`
12. Video news — YouTube URL on article
13. Today's date in header
14. Reading progress bar on article pages
15. Related articles
16. Ad slots (header/sidebar/footer HTML in Settings)
17. Poll widget — Admin → Polls
18. Comments (login required)
19. Don't miss (top viewed)
20. Sticky navbar

## New packages

```bash
npm install react-fast-marquee embla-carousel-react embla-carousel-autoplay
```
