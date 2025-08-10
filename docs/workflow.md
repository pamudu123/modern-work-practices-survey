# Project Specification: Questionnaire Web Application

This document outlines the content, features, and functional requirements for a web-based questionnaire application. A simple black and white design is preferred.

## 1. Questionnaire Content

The application will present a questionnaire divided into the following sections and questions.

### **Section 1: General Questions**

* **Which department do you work in?**
    * IT / Technology / Engineering
    * Human Resources (HR)
    * Healthcare Services
    * Finance / Accounting
    * Legal / Compliance
    * Sales / Business Development
    * Supply Chain / Procurement / Logistics
    * Other... [user should enter]

* **What is your current job title/position?**
    * Director / Head of Department
    * Manager
    * Team Lead / Supervisor
    * Engineer / Developer
    * Technician / Operator
    * Consultant / Advisor
    * Coordinator / Administrator
    * Sales / Business Development Representative
    * Customer Service / Support Representative
    * Designer / Creative Professional
    * Researcher / Scientist
    * Healthcare Professional
    * Educator / Trainer
    * Intern / Trainee
    * Other... [user should enter]

* **How many years of experience do you have in your profession?**
    * Less than 1 year
    * 1 - 3 years
    * 3 - 5 years
    * 5 - 8 years
    * 8 - 12 years
    * 12 - 20 years
    * More than 20 years

* **What is your primary work arrangement?**
    * On-site
    * Fully Remote
    * Hybrid

* **Which of the following best describes your typical working hours?**
    * **Standard Fixed Hours:** Same hours every day during a normal workday (e.g., 8:30 AM to 5:00 PM).
    * **Fixed Time-Zone Shift:** A fixed schedule matched to another country's time zone (e.g., UK or US shifts).
    * **Flexible Hours:** You choose your start and end times but work a set number of hours daily.
    * **Rotating Shift-based Work:** Your schedule cycles through different shifts (e.g., mornings one week, nights the next).
    * **Irregular/Unpredictable Hours:** No set schedule; your hours change often based on project needs or deadlines.
    * *(The choices for the user will be the titles: Standard Fixed Hours, Fixed Time-Zone Shift, etc.)*

---

### **Section 2: Work-Life Balance Scale [by J. Hayman (2005)]**

> **Instructions:** Please rate your level of agreement with the following statements.
> **Scale:** `1 = Strongly Disagree` | `2 = Disagree` | `3 = Neutral` | `4 = Agree` | `5 = Strongly Agree`

#### **2.1 Work Interference with Personal Life (WIPL)**

* My personal life suffers because of my work.
* I feel like I have to reply to work messages or emails even after hours.
* Work is so fast-paced that I can’t fully relax after hours.
* I am unhappy with the amount of time for non-work activities.

#### **2.2 Personal Life Interference with Work (PLIW)**

* My personal life drains me of the energy I need for my work.
* Distractions in my home environment during my work hours make it difficult to focus.
* Because of personal commitments, I take part less in team communication or meetings.
* I don’t spend much time with my teammates outside of work because of personal matters (e.g., team outings or informal chats).

#### **2.3 Work/Personal Life Enhancement (WPLE)**

* I have enough control over my job to manage both work and personal life well.
* The flexibility my job offers (in hours or location) helps me better manage my personal responsibilities.
* My personal life gives me energy for my job.
* My job helps me feel energetic for my personal life too.

---

### **Section 3: The Modern Work Experience**

> **Instructions:** Please rate your level of agreement with the following statements.
> **Scale:** `Not Applicable` | `1 = Strongly Disagree` | `2 = Disagree` | `3 = Neutral` | `4 = Agree` | `5 = Strongly Agree`

* AI tools help me work faster and improve my work-life balance.
* I feel pressured to work at the same time as my colleagues, even when my tasks could be done on a more flexible schedule.
* I feel comfortable talking to my manager if I am feeling overwhelmed or stressed by my work.
* I find it difficult to "switch off" from work at the end of the day when working from home.
* Working remotely makes me feel socially disconnected from my colleagues and the company culture.
* The digital tools and communication platforms we use help me collaborate effectively with my team.

---

### **Section 4: Final Report**

* Would you like to receive the final analysis report when it is ready? (Yes/No)
* [Optional] Please provide your email address: `________________`
    * **Note:** The email input field should only appear if the user selects 'Yes' for the question above.

## 2. UI/UX and Functional Requirements

1.  **User Interface (UI):**
    * The UI should be simple, clean, and user-friendly with a black and white theme.
    * Use images from the provided `resources/` folder to enhance the visual design where appropriate.

2.  **Dynamic Section Behavior:**
    * Once a user answers all questions within a section or subsection (e.g., 2.1 WIPL), that section/subsection should automatically collapse or be hidden.
    * The user must be able to click on the section's/subsection's title to expand it again, allowing them to review or edit their answers before submission.

3.  **Form Submission and Validation:**
    * When the user clicks the **Submit** button, the form must be validated.
    * If any required questions are unanswered, a clear error message should appear, prompting the user to complete the form. The unanswered questions should be highlighted.

4.  **Data Storage:**
    * Responses are submitted to a Google Apps Script Web App and stored in Google Sheets.
    * The Thank You page may show a simple total submissions count.

5.  **Confirmation/Thank You Page:**
    * After successful submission, the user must be navigated to a new page or window that displays a "Thank You" message.
    * This page should also include the following call to action:
        > "Thank you for participating. If you would like to conduct a similar survey analysis for your company or group, please contact us at [Your Contact Email/Link]."

## 3. Assets

* All necessary images are located in the `resources/` directory.
* Screenshots of the Google Form version (as provided) should be used as a visual reference for the UI design.