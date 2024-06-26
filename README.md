<a name="readme-top"></a>

<br />
<div align="center">
  <a href="https://github.com/JasonXu314/truhacks-2024/tree/master">
    <img src="https://github.com/JasonXu314/truhacks-2024/blob/master/frontend/public/img/logoReadme.png" alt="Logo" width="200" height="200">
  </a>
   <br />
    <br />
  <p align="center">👋 
    Live interactive platform that connects students worldwide with passionate tutors. No matter your location, time zone, or budget, you can now access expert guidance and conquer any academic challenge. 
    <br />
  </p>
</div>
<div align="center">
<a href="https://youtu.be/fsC-bcyBFTs">📷 View Demo</a>
</div>
<br />

![image](https://github.com/JasonXu314/truhacks-2024/assets/86029622/bb59e15e-33d1-46df-80c2-eb4ef17489b4)

![image](https://github.com/JasonXu314/truhacks-2024/assets/86029622/f368eac5-1603-4879-8adc-bb1b6fe93646)



<!-- ABOUT THE PROJECT -->
## Inspiration
Driven by a team member's powerful story as a first-generation immigrant, who achieved success through education, we're passionate about making learning accessible to all. Their journey underscores our belief that education is a fundamental human right, not a privilege.

Furthermore, our experience as tutors highlighted the limitations of existing tutoring platforms. College software is often clunky and uninviting, while popular video conferencing tools like Zoom can become expensive for extended sessions. These hurdles prevent students from receiving the ongoing support they need.

That's why we built a free, full-stack web application that removes these barriers. Our streamlined design keeps students engaged, while built-in live, one-on-one video calls with tutors allow for in-depth explanations.  To maximize interactivity and collaboration, we've also incorporated a virtual whiteboard with various colored pens.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



## What it does
Our live and interactive platform empowers students to connect with tutors for personalized learning. Through our intuitive web application, students can easily create accounts and access their dedicated "Student Hub." Here, they can write their questions, choose a subject, and submit them directly to qualified tutors. Tutors, using their own dashboards, can review student requests and choose to accept.

Recognizing the value of face-to-face interaction, we've integrated live video calls into every session. To further enhance collaboration and explanation, students and tutors can utilize a real-time whiteboard with multiple colored pens. Committed to equitable access to education, we offer unlimited session lengths and avoid hidden fees. We believe quality learning should be available to everyone, everywhere.

Features:
- [x] - Homepage with additional recources
- [x] - Authentication. Sign up/Sign in pages.
- [x] - User can select the subject and type out their question. Ability to request a tutor.
- [x] - Ability to start a tutoring session. 
- [x] - Video/Audio Live Streaming
- [x] - Collaborative Whiteboard with colors and eraser

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->
## How we built it
Design: Figma, Canva. Link for the file.
<br/>
https://www.figma.com/file/hAdIcWvibrVcMLhtwVwwoz/TruHacks?type=design&node-id=0%3A1&mode=design&t=VsIXoefMQemjE9rR-1

Have built a prototype, developed friendly UI and made sure the design is consistent and easy to navigate.

**We used Next.js to create a fullstack application and we are running local server.**

## Frontend: 
WebRTC API to establish video, audio streaming. WebRTC its an open-source application that covers, on a high level, two different technologies: media capture devices and peer-to-peer connectivity. Learning how to live-stream video and audio was quite a challenge. We faced several struggles working with this: couldn’t connect to a peer, couldn’t see/hear the peer. 
<br/>

For better interaction and streamlined learning, we incorporated a whiteboard using in-built Javascript API canvas. We were able to make a whiteboard with eraser and different colored pencil. One of the challenges we faced: making the whiteboard collaborative. We used web-sockets to ensure sable connection between the server and the client. It was really good decision, since they are perfect for real time updates.


Tailwind CSS, Shadcn/Hoverdev Components
for quick UI building

## Backend:

MySQL to store the data for user profiles, requests, etc.

Bcrypt library and pwd hashing for secure authentication.

Prisma to interract with the database and perform migrations.

Next.js and Express to build REST API.

WebSocket API (WebSockets) to ensure a two-way interactive communication session between the user's browser and a server.


## Installation

THis is how to build the project. You would need to run the server too in order to complete the project.
* npm
  ```sh
  npm install npm@latest -g
  npm run dev
  ```

## Team
Eric Wong - Frontend/Backend Devlopment - [LinkedIn](https://www.linkedin.com/in/ewbyf/)


Jason Xu - Backend Devlopment - [LinkedIn](https://www.linkedin.com/in/jx6pc/)

Aiturgan Talant - Frontend Development, UX/UI - [LinkedIn](https://www.linkedin.com/in/aiturgantalant/)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->
## What's next for EducateAll
- Speech-to-Text recognition to make notes of the sessions
- Advanced Recources library
- Google Sign In
- Profile Tab and have achivements, badges, to make the platform more engaging
- AI Assistant
<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Acknowledgments

* [Illustrations Library](https://undraw.co/)
* [Web RTC Docs](https://webrtc.org/getting-started/overview)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/github_username/repo_name.svg?style=for-the-badge
[contributors-url]: https://github.com/github_username/repo_name/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/github_username/repo_name.svg?style=for-the-badge
[forks-url]: https://github.com/github_username/repo_name/network/members
[stars-shield]: https://img.shields.io/github/stars/github_username/repo_name.svg?style=for-the-badge
[stars-url]: https://github.com/github_username/repo_name/stargazers
[issues-shield]: https://img.shields.io/github/issues/github_username/repo_name.svg?style=for-the-badge
[issues-url]: https://github.com/github_username/repo_name/issues
[license-shield]: https://img.shields.io/github/license/github_username/repo_name.svg?style=for-the-badge
[license-url]: https://github.com/github_username/repo_name/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/linkedin_username
[product-screenshot]: images/screenshot.png
[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Vue.js]: https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D
[Vue-url]: https://vuejs.org/
[Angular.io]: https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white
[Angular-url]: https://angular.io/
[Svelte.dev]: https://img.shields.io/badge/Svelte-4A4A55?style=for-the-badge&logo=svelte&logoColor=FF3E00
[Svelte-url]: https://svelte.dev/
[Laravel.com]: https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white
[Laravel-url]: https://laravel.com
[Bootstrap.com]: https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white
[Bootstrap-url]: https://getbootstrap.com
[JQuery.com]: https://img.shields.io/badge/jQuery-0769AD?style=for-the-badge&logo=jquery&logoColor=white
[JQuery-url]: https://jquery.com 
