---
title: Home
layout: layouts/base
description: Welcome to Zephyr Solutions - Help with computers, websites, and tech for smaller organizations and non-profits
permalink: /
---

<!-- Hero Section -->
<section id="home" class="section hero-section parallax-container">
  <div class="parallax-bg hero-bg"></div>
  <div class="hero-content">
    <div class="hero-logo">
      <img src="{{ '/images/zephyr-solutions-logo.png' | base }}" alt="Zephyr Solutions Logo" class="hero-logo-image">
    </div>
    <p class="hero-subtitle">Help with computers, websites, and tech—for smaller organizations and non-profits</p>
    <p class="hero-description">Not sure where to start with your website, email, or the software your team uses? We're here to help in plain English. No tech jargon, no eye-rolling—just friendly support that actually makes sense.</p>
    <div class="hero-cta-group">
      <a href="{{ '#services' | base }}" class="button hero-cta">See How We Can Help</a>
      <a href="{{ '/health-check/' | base }}" class="button button--secondary hero-cta">Free IT & Web Assessment</a>
    </div>
  </div>
  <div class="parallax-fg hero-illustration">
    <img src="{{ '/images/hero-illustration.png' | base }}" alt="Technology innovation" class="hero-illustration-image">
  </div>
</section>

<!-- About Section -->
<section id="about" class="section about-section">
  <div class="container">
    <h2>About Zephyr Solutions</h2>
    <div class="two-column-content">
      <div class="column-left">
        <p class="lead">We help make the tech side of things less confusing—and more useful—for organizations like yours.</p>
        <p>We get what it's like to run a small team or non-profit: you're busy, and the last thing you need is someone talking in code words about "systems" and "infrastructure." We speak your language and we're happy to explain things step by step.</p>
        <p>Our goal is simple: help you with your computers, your website, and your day-to-day tech—without the corporate speak, the huge price tags, or the feeling that you're bothering someone with "silly" questions. (There are no silly questions!)</p>
      </div>
      <div class="column-right parallax-mid">
        <div class="illustration-card">
          <img src="{{ '/images/about-illustration.png' | base }}" alt="Friendly tech support - people working together" class="illustration-image">
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Services Section -->
<section id="services" class="section services-section parallax-container" style="background: var(--color-surface-variant);">
  <div class="parallax-bg services-bg"></div>
  <div class="container">
    <h2>What We Do</h2>
    <p class="section-intro">We help with websites, online tools, and the kind of tech that keeps your organization running. Here’s the kind of stuff we do—all explained in plain language:</p>
    
    <div class="service-item">
      <div class="two-column-content">
        <div class="column-left">
          <h3>Websites & Online Tools</h3>
          <p>We build and fix websites—the kind people visit in their browser—and simple online tools your team can use without installing anything.</p>
          <p>Need a new website, updates to the one you have, or a small tool that runs in the browser (like a form or a simple app)? We handle both what visitors see on the page and the behind-the-scenes setup that makes it work. We keep things running smoothly and secure.</p>
          <p>From a simple “brochure” site that tells people who you are to something a bit more involved, we build what fits your needs and your budget.</p>
        </div>
        <div class="column-right parallax-mid">
          <div class="illustration-card">
            <img src="{{ '/images/services/strategy-background.png' | base }}" alt="Websites and online tools" class="illustration-image">
          </div>
        </div>
      </div>
    </div>
    
    <div class="service-item">
      <div class="two-column-content two-column-content--reverse">
        <div class="column-left">
          <h3>Online Storage & Letting the Computer Do the Work</h3>
          <p>We help you use the internet to store files and run your work safely, and we set up ways for boring, repeat tasks to run on their own—so you don’t have to do them by hand every time.</p>
          <p>“Moving to the cloud” just means using online services instead of a computer in your office. We help you get set up, keep things backed up, and make sure updates happen without you having to think about it. Less clicking, fewer mistakes, and more time for the work that actually matters.</p>
          <p>Whether you’re switching to something like Microsoft’s online services or just want certain tasks to happen automatically, we make it straightforward instead of overwhelming.</p>
        </div>
        <div class="column-right parallax-mid">
          <div class="illustration-card">
            <img src="{{ '/images/services/implementation-background.png' | base }}" alt="Online storage and automation" class="illustration-image">
          </div>
        </div>
      </div>
    </div>
    
    <div class="service-item">
      <div class="two-column-content">
        <div class="column-left">
          <h3>Switching to Online Tools (and Leaving Old Setups Behind)</h3>
          <p>If your data or software still lives on a server or computer in your office, we can help you move it to tools that run in the browser—so you can work from anywhere and spend less time maintaining old equipment.</p>
          <p>We help you choose the right tools, plan the move, and do the technical part of getting your information and processes into the new system. We also help you set up and get comfortable with things like project management tools and contact databases so they work the way you need.</p>
          <p>The goal: you use up-to-date, web-based tools without the headache of managing servers or fighting with outdated software.</p>
        </div>
        <div class="column-right parallax-mid">
          <div class="illustration-card">
            <img src="{{ '/images/services/integration-background.png' | base }}" alt="Switching to online tools" class="illustration-image">
          </div>
        </div>
      </div>
    </div>
    
    <div class="service-item">
      <div class="two-column-content two-column-content--reverse">
        <div class="column-left">
          <h3>Automating Repetitive Tasks</h3>
          <p>We help you stop doing the same boring steps over and over. If the computer can do it, we set it up so it does.</p>
          <p>Do you copy data from one place to another every week? Generate the same reports by hand? Update the same files again and again? We set up automated steps so those tasks run on their own. You get fewer mistakes and more time for the work that needs a human.</p>
          <p>Whether it’s form responses that need to go somewhere, keeping information in sync between different programs, or a custom process for your team, we help you work smarter—not harder.</p>
        </div>
        <div class="column-right parallax-mid">
          <div class="illustration-card">
            <img src="{{ '/images/services/support-background.png' | base }}" alt="Automating repetitive tasks" class="illustration-image">
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Work/Portfolio Section -->
<section id="work" class="section work-section">
  <div class="container">
    <h2>Our Work</h2>
    <p class="section-intro">Here’s how we’ve helped other organizations like yours get more out of their websites and day-to-day tech:</p>
    
    {% for item in collections.portfolio | limit(3) %}
      <div class="portfolio-item">
        <div class="two-column-content{% if loop.index % 2 == 0 %} two-column-content--reverse{% endif %}">
          <div class="column-left">
            <h3>{{ item.data.title }}</h3>
            {% if item.data.summary %}
              <p class="lead">{{ item.data.summary }}</p>
            {% endif %}
            {% if item.data.industries or item.data.servicesUsed %}
              <div class="portfolio-item__tags">
                {% if item.data.industries %}
                  {% for industry in item.data.industries %}
                    <span class="tag tag--industry">{{ industry }}</span>
                  {% endfor %}
                {% endif %}
                {% if item.data.servicesUsed %}
                  {% for service in item.data.servicesUsed %}
                    <span class="tag tag--service">{{ service }}</span>
                  {% endfor %}
                {% endif %}
              </div>
            {% endif %}
            <a href="{{ item.data.permalink | base }}" class="button" aria-label="Read case study: {{ item.data.title }}">Read Case Study →</a>
          </div>
          <div class="column-right parallax-mid">
            <div class="illustration-card">
              {% if item.data.heroImage %}
                <img src="{{ item.data.heroImage | base }}" alt="{{ item.data.heroImageAlt | default(item.data.title) }}" class="illustration-image" loading="lazy">
              {% endif %}
            </div>
          </div>
        </div>
      </div>
    {% endfor %}
  </div>
</section>

<!-- Contact Section -->
<section id="contact" class="section contact-section parallax-container" style="background: var(--color-surface-variant);">
  <div class="parallax-bg contact-bg"></div>
  <div class="container">
    <h2>Let's Talk!</h2>
    <p class="section-intro">We’d love to hear from you. Have a specific project in mind, or just a vague feeling that your tech could be better? Either way, we’re happy to chat—no pressure, no jargon.</p>
    
    <div class="contact-content">
      <div class="contact-info">
        <p><strong>Email:</strong> <a href="{{ globalSettings.contact.email | mailto(contact.emailTemplate.subject, contact.emailTemplate.body) }}">{{ globalSettings.contact.email }}</a></p>
        <p><strong>Phone:</strong> {{ globalSettings.contact.phone }}</p>
        <p>Not sure what you need or how to describe it? That’s okay. We’re used to it. Reach out and we’ll have a friendly conversation about what you’re working with and how we might help.</p>
      </div>
      <div class="contact-illustration parallax-fg">
        <img src="{{ '/images/contact-illustration.png' | base }}" alt="Get in touch - friendly communication" class="contact-image">
      </div>
    </div>
    
    <div class="cta-section">
      <p>Ready to start the conversation?</p>
      <a href="{{ globalSettings.contact.email | mailto(contact.emailTemplate.subject, contact.emailTemplate.body) }}" class="button">Get in Touch</a>
    </div>
  </div>
</section>
