---
layout: layouts/base
title: Our Work
permalink: /work/
description: Explore our portfolio of IT consulting projects and case studies for smaller organizations and non-profits.
---

## Portfolio

Browse our case studies to see how we've helped organizations like yours achieve their IT goals.

<div class="portfolio-index">
  <div class="portfolio-grid">
    {% for item in collections.portfolio %}
      <article class="portfolio-card">
        {% if item.data.heroImage %}
          <div class="portfolio-card__image">
            <a href="{{ basePath }}work/{{ item.data.slug }}/">
              <img src="{{ item.data.heroImage | base }}" alt="{{ item.data.heroImageAlt | default(item.data.title) }}" loading="lazy">
            </a>
          </div>
        {% endif %}
        <div class="portfolio-card__content">
          <h2 class="portfolio-card__title">
            <a href="{{ '/work/' | base }}{{ item.data.slug }}/">{{ item.data.title }}</a>
          </h2>
          {% if item.data.summary %}
            <p class="portfolio-card__summary">{{ item.data.summary }}</p>
          {% endif %}
          {% if item.data.industries or item.data.servicesUsed %}
            <div class="portfolio-card__meta">
              {% if item.data.industries %}
                <div class="portfolio-card__tags">
                  {% for industry in item.data.industries %}
                    <span class="tag tag--industry">{{ industry }}</span>
                  {% endfor %}
                </div>
              {% endif %}
              {% if item.data.servicesUsed %}
                <div class="portfolio-card__tags">
                  {% for service in item.data.servicesUsed %}
                    <span class="tag tag--service">{{ service }}</span>
                  {% endfor %}
                </div>
              {% endif %}
            </div>
          {% endif %}
          <a href="{{ '/work/' | base }}{{ item.data.slug }}/" class="portfolio-card__link">Read Case Study →</a>
        </div>
      </article>
    {% endfor %}
  </div>
</div>

<p><em>Note: Portfolio items can be filtered by industry tags (blue) and service tags (green) shown on each card. Featured items are marked in the CMS.</em></p>
