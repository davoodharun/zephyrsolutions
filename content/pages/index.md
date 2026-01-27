---
title: Home
layout: layouts/base
description: Welcome to Zephyr Solutions - IT Consulting for Smaller Organizations and Non-Profits
permalink: /
---

<!-- Hero Section -->
<section id="home" class="section hero-section parallax-container">
  <div class="parallax-bg hero-bg"></div>
  <div class="hero-content">
    <div class="hero-logo">
      <img src="{{ '/images/zephyr-solutions-logo.png' | base }}" alt="Zephyr Solutions Logo" class="hero-logo-image">
    </div>
    <p class="hero-subtitle">Making technology work for smaller organizations and non-profits</p>
    <p class="hero-description">We help organizations navigate technology challenges without the complexity. Think of us as your friendly tech partner who speaks your language—no confusing jargon, just practical solutions.</p>
    <a href="{{ '#services' | base }}" class="button hero-cta">See How We Can Help</a>
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
        <p class="lead">We're here to make technology less scary and more helpful for organizations like yours.</p>
        <p>Think of us as your friendly tech neighbors who actually understand what it's like to run a smaller organization. We know you're juggling a million things, and technology shouldn't be one of the stressful ones.</p>
        <p>Our mission is simple: give you the IT help you need without the corporate speak, the huge price tags, or the feeling that you're bothering someone with "dumb questions." (Spoiler: there are no dumb questions!)</p>
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
    <p class="section-intro">Every organization is unique, and so are your technology needs. We offer services designed specifically for smaller teams and tighter budgets:</p>
    
    <div class="service-item">
      <div class="two-column-content">
        <div class="column-left">
          <h3>IT Strategy & Planning</h3>
          <p>We help you figure out what technology you actually need (and what you don't) so you can make smart decisions without breaking the bank.</p>
          <p>Technology can feel overwhelming when you're trying to run an organization. There are so many options, and it's hard to know what's essential versus what's just nice to have. We sit down with you to understand your goals, your budget, and your team's needs. Then we create a clear, practical plan that helps you move forward without getting stuck in analysis paralysis.</p>
          <p>Whether you're starting from scratch or trying to make sense of what you already have, we'll help you build a technology roadmap that actually makes sense for your organization.</p>
        </div>
        <div class="column-right parallax-mid">
          <div class="illustration-card">
            <img src="{{ '/images/services/strategy-background.png' | base }}" alt="IT Strategy & Planning" class="illustration-image">
          </div>
        </div>
      </div>
    </div>
    
    <div class="service-item">
      <div class="two-column-content two-column-content--reverse">
        <div class="column-left">
          <h3>Technology Implementation</h3>
          <p>When you're ready to upgrade or add new tools, we make sure everything works smoothly and your team knows how to use it.</p>
          <p>Buying new software or hardware is one thing—getting it set up and actually working for your team is another. We handle the technical setup so you don't have to stress about configurations, integrations, or compatibility issues. We also make sure your team feels comfortable using the new tools, not just confused by them.</p>
          <p>From cloud migrations to new software rollouts, we take care of the details so you can focus on what matters: using technology to make your work easier, not harder.</p>
        </div>
        <div class="column-right parallax-mid">
          <div class="illustration-card">
            <img src="{{ '/images/services/implementation-background.png' | base }}" alt="Technology Implementation" class="illustration-image">
          </div>
        </div>
      </div>
    </div>
    
    <div class="service-item">
      <div class="two-column-content">
        <div class="column-left">
          <h3>System Integration</h3>
          <p>Got different systems that don't talk to each other? We help them work together so you spend less time switching between tools.</p>
          <p>You probably use multiple tools for different parts of your work—maybe one for email, another for project management, and something else for customer data. When these systems don't connect, you end up doing the same work in multiple places, which wastes time and increases the chance of errors.</p>
          <p>We help your tools work together seamlessly. Whether that means connecting your CRM to your email system, syncing data between platforms, or automating repetitive tasks, we make sure your technology stack works as a team, not as a collection of disconnected pieces.</p>
        </div>
        <div class="column-right parallax-mid">
          <div class="illustration-card">
            <img src="{{ '/images/services/integration-background.png' | base }}" alt="System Integration" class="illustration-image">
          </div>
        </div>
      </div>
    </div>
    
    <div class="service-item">
      <div class="two-column-content two-column-content--reverse">
        <div class="column-left">
          <h3>Ongoing Support</h3>
          <p>Technology issues shouldn't derail your day. We're here when you need help, with support that's actually helpful and easy to understand.</p>
          <p>Things break, questions come up, and sometimes you just need someone who can explain what's happening in plain English. That's where we come in. We offer ongoing support that's responsive, practical, and free of technical jargon.</p>
          <p>Whether it's a quick question about how to do something, troubleshooting a problem, or helping your team learn new features, we're here to help. You don't need to be a tech expert to get things done—you just need someone who can translate technology into solutions that make sense for your work.</p>
        </div>
        <div class="column-right parallax-mid">
          <div class="illustration-card">
            <img src="{{ '/images/services/support-background.png' | base }}" alt="Ongoing Support" class="illustration-image">
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
    <p class="section-intro">See how we've helped organizations like yours use technology more effectively:</p>
    
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
    <p class="section-intro">We'd love to hear from you. Whether you have a specific project in mind or you're just curious about how we might help, we're here to chat.</p>
    
    <div class="contact-content">
      <div class="contact-info">
        <p><strong>Email:</strong> <a href="mailto:info@zephyrsolutions.com">info@zephyrsolutions.com</a></p>
        <p><strong>Phone:</strong> +1-555-0123</p>
        <p>Have a question? Not sure where to start? That's totally fine! We're happy to have a friendly conversation about what you're working with and how we might be able to help.</p>
      </div>
      <div class="contact-illustration parallax-fg">
        <img src="{{ '/images/contact-illustration.png' | base }}" alt="Get in touch - friendly communication" class="contact-image">
      </div>
    </div>
    
    <div class="cta-section">
      <p>Ready to start the conversation?</p>
      <a href="mailto:info@zephyrsolutions.com" class="button">Get in Touch</a>
    </div>
  </div>
</section>
