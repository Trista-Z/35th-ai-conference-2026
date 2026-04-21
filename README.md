# Human-Machine Symbiosis 2026 Website

Multi-page conference website:

- `index.html` - Home
- `program.html` - Program
- `speakers.html` - Speakers
- `registration.html` - Registration form
- `styles.css` - Shared premium theme
- `script.js` - Navigation highlight + form submission logic

## Enable Real Submission

Open `registration.html` and replace:

- `data-formspree="https://formspree.io/f/your-form-id"`
- `data-api="https://your-domain.com/api/registration"`

Form submission modes:

1. **Formspree mode** (email delivery): choose "Formspree" in the form.
2. **Custom API mode**: choose "Custom API endpoint" and provide your backend endpoint.

## Suggested Custom API Contract

- Method: `POST`
- Content-Type: `application/json`
- Body fields: `full_name`, `email`, `organization`, `title`, `country`, `track`, `message`
- Return: `200` with JSON for success.

## Local Preview

In this folder, run:

`python3 -m http.server 8080`

Then open:

`http://localhost:8080/index.html`
