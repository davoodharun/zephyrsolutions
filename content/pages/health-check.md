---
title: Free IT & Web Assessment
layout: layouts/base
description: Take our free assessment to see what types of IT and web development support your organization might need
permalink: /health-check/
---

<section class="section health-check-section">
  <div class="container">
    <h1>Free IT & Web Assessment</h1>
    <p class="section-intro">This free assessment helps you see what kinds of IT and web development support your organization might need. Answer a few questions and we'll send you a personalized summary and recommendations—no jargon, no pressure.</p>
    
    <form id="health-check-form" class="health-check-form">
      <div class="form-group">
        <label for="org_name">Organization Name <span class="required">*</span></label>
        <input type="text" id="org_name" name="org_name" required>
        <span class="error-message" id="org_name_error"></span>
      </div>

      <div class="form-group">
        <label for="contact_name">Your Name <span class="required">*</span></label>
        <input type="text" id="contact_name" name="contact_name" required>
        <span class="error-message" id="contact_name_error"></span>
      </div>

      <div class="form-group">
        <label for="email">Email Address <span class="required">*</span></label>
        <input type="email" id="email" name="email" required>
        <span class="error-message" id="email_error"></span>
      </div>

      <div class="form-group">
        <label for="org_size">Organization Size <span class="required">*</span></label>
        <select id="org_size" name="org_size" required>
          <option value="">Select size...</option>
          <option value="1-10">1-10 employees</option>
          <option value="11-50">11-50 employees</option>
          <option value="51-200">51-200 employees</option>
          <option value="200+">200+ employees</option>
        </select>
        <span class="error-message" id="org_size_error"></span>
      </div>

      <div class="form-group">
        <label>Current Tools & Technologies <span class="required">*</span></label>
        <p class="field-help">Select all that apply</p>
        <div class="checkbox-group">
          <label><input type="checkbox" name="current_tools" value="Microsoft Office"> Microsoft Office</label>
          <label><input type="checkbox" name="current_tools" value="Excel"> Excel</label>
          <label><input type="checkbox" name="current_tools" value="Google Workspace"> Google Workspace</label>
          <label><input type="checkbox" name="current_tools" value="Google Forms"> Google Forms</label>
          <label><input type="checkbox" name="current_tools" value="Google Sheets"> Google Sheets</label>
          <label><input type="checkbox" name="current_tools" value="Slack"> Slack</label>
          <label><input type="checkbox" name="current_tools" value="Microsoft Teams"> Microsoft Teams</label>
          <label><input type="checkbox" name="current_tools" value="SharePoint"> SharePoint</label>
          <label><input type="checkbox" name="current_tools" value="Custom Software"> Custom Software</label>
          <label><input type="checkbox" name="current_tools" value="Cloud Services"> Cloud Services (AWS, Azure, etc.)</label>
          <label><input type="checkbox" name="current_tools" value="CRM System"> CRM System</label>
          <label><input type="checkbox" name="current_tools" value="Email Server"> Email Server</label>
          <label><input type="checkbox" name="current_tools" value="Website/CMS"> Website/CMS</label>
          <label><input type="checkbox" name="current_tools" value="Other"> Other</label>
        </div>
        <span class="error-message" id="current_tools_error"></span>
      </div>

      <div class="form-group">
        <label>Top Pain Points <span class="required">*</span></label>
        <p class="field-help">Select all that apply</p>
        <div class="checkbox-group">
          <label><input type="checkbox" name="top_pain_points" value="Data backup"> Data backup concerns</label>
          <label><input type="checkbox" name="top_pain_points" value="Security concerns"> Security concerns</label>
          <label><input type="checkbox" name="top_pain_points" value="Outdated systems"> Outdated systems</label>
          <label><input type="checkbox" name="top_pain_points" value="Limited IT support"> Limited IT support</label>
          <label><input type="checkbox" name="top_pain_points" value="Integration issues"> Integration issues between systems</label>
          <label><input type="checkbox" name="top_pain_points" value="Budget constraints"> Budget constraints</label>
          <label><input type="checkbox" name="top_pain_points" value="Staff training"> Staff training needs</label>
          <label><input type="checkbox" name="top_pain_points" value="Compliance"> Compliance requirements</label>
          <label><input type="checkbox" name="top_pain_points" value="Large maintenance overhead"> Large maintenance overhead</label>
          <label><input type="checkbox" name="top_pain_points" value="Too much time on repetitive tasks"> Too much time on repetitive tasks</label>
          <label><input type="checkbox" name="top_pain_points" value="Website maintenance"> Website maintenance</label>
        </div>
        <span class="error-message" id="top_pain_points_error"></span>
      </div>

      <div class="form-group">
        <label for="backups_maturity">Backup Strategy Maturity <span class="required">*</span></label>
        <p class="field-help">How regularly do you back up your data? (e.g. files, databases). If you're not sure, choose "Not sure" below.</p>
        <select id="backups_maturity" name="backups_maturity" required>
          <option value="">Select level...</option>
          <option value="none">No regular backups</option>
          <option value="basic">Manual backups occasionally</option>
          <option value="regular">Regular manual backups</option>
          <option value="automated">Automated backups</option>
          <option value="cloud-based">Cloud-based automated backups</option>
          <option value="not_sure">Not sure</option>
        </select>
        <span class="error-message" id="backups_maturity_error"></span>
      </div>

      <div class="form-group">
        <label for="security_confidence">Security Confidence Level <span class="required">*</span></label>
        <p class="field-help">How confident are you that your systems and data are protected? (passwords, access, updates). Choose "Not sure" if you'd rather not say.</p>
        <select id="security_confidence" name="security_confidence" required>
          <option value="">Select level...</option>
          <option value="very_low">Very low - not confident</option>
          <option value="low">Low - some concerns</option>
          <option value="moderate">Moderate - mostly confident</option>
          <option value="high">High - very confident</option>
          <option value="very_high">Very high - excellent security</option>
          <option value="not_sure">Not sure</option>
        </select>
        <span class="error-message" id="security_confidence_error"></span>
      </div>

      <div class="form-group">
        <label for="budget_comfort">Budget Comfort Level <span class="required">*</span></label>
        <select id="budget_comfort" name="budget_comfort" required>
          <option value="">Select level...</option>
          <option value="very_limited">Very limited - minimal budget</option>
          <option value="limited">Limited - small budget available</option>
          <option value="moderate">Moderate - reasonable budget</option>
          <option value="comfortable">Comfortable - good budget flexibility</option>
          <option value="flexible">Flexible - budget not a primary constraint</option>
        </select>
        <span class="error-message" id="budget_comfort_error"></span>
      </div>

      <div class="form-group">
        <label for="timeline">Project Timeline <span class="required">*</span></label>
        <select id="timeline" name="timeline" required>
          <option value="">Select timeline...</option>
          <option value="immediate">Immediate - need help now</option>
          <option value="1-3 months">1-3 months</option>
          <option value="3-6 months">3-6 months</option>
          <option value="6-12 months">6-12 months</option>
          <option value="flexible">Flexible - no specific timeline</option>
        </select>
        <span class="error-message" id="timeline_error"></span>
      </div>

      <div class="form-group">
        <label for="notes">Additional Notes (Optional)</label>
        <textarea id="notes" name="notes" rows="4" maxlength="1000"></textarea>
        <span class="field-help">Any additional context about your organization's IT situation</span>
      </div>

      <!-- Honeypot field (hidden from users) -->
      <div class="form-group" style="position: absolute; left: -9999px; opacity: 0;">
        <label for="honeypot">Leave this field empty</label>
        <input type="text" id="honeypot" name="honeypot" tabindex="-1" autocomplete="off">
      </div>

      <div id="form-messages" class="form-messages"></div>

      <button type="submit" class="button" id="submit-button">
        Submit Assessment
      </button>
    </form>
  </div>
</section>

<script src="{{ '/js/health-check-form.js' | base }}" defer></script>
