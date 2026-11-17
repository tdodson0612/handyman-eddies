# Handyman Eddie's — Website

A static website for Handyman Eddie's (carpentry and home remodeling), built with plain HTML, CSS, and JavaScript. It needs no build step.

## Files

```
handyman-eddies/
├── index.html      # Page content
├── css/styles.css  # Colors, fonts, layout
├── js/main.js      # Menu, estimator, filters, slider, form
└── README.md
```

## Before going live, replace the placeholders

- Phone `(555) 555-5555` and `tel:+15555555555` in `index.html`
- Email `eddie@example.com` in `index.html` **and** `BUSINESS_EMAIL` in `js/main.js`
- `[Your City]` in the Contact section
- Sample reviews in the Reviews section (use real customer quotes only)
- Years of experience / project counts in the About section (`data-count` values)
- Project placeholder art: add photos to an `images/` folder and swap each
  `<div class="project-img img-1"></div>` for `<img class="project-img" src="images/kitchen.jpg" alt="Kitchen remodel">`

## Change the hourly rate

Update `HOURLY_RATE` in `js/main.js` and the `$90` text in `index.html`.

## Preview locally

Open `index.html` in a browser, or use the VS Code **Live Server** extension (right-click `index.html` → *Open with Live Server*).
