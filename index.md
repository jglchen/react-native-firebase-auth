---
#
# By default, content added below the "---" mark will appear in the home page
# between the top bar and the list of recent posts.
# To change the home page layout, edit the _layouts/home.html file.
# See: https://jekyllrb.com/docs/themes/#overriding-theme-defaults
#
layout: home
---

This example creates an authentication system that uses **an encrypted storage to store session data**.
 
- Firebase Authentication with Email/Password, Google Sign In, GitHub Sign In, and Email Sign In available to authenticate users.
- The emails registered in Firebase Authentication are saved in a separate database for future data development of individual users, for this illustration Firestore Database.
- Session data is encrypted in local storage.

**iOS** and **Android** mobile apps are developed with **React Native**, anyone who is interested can test the development builds with [iOS Simulator Build](https://expo.dev/accounts/jglchen/projects/firebase-auth/builds/da8ba431-1739-4dd2-8735-2a2a65836d18) and [Android Internal Distribution Build](https://expo.dev/accounts/jglchen/projects/firebase-auth/builds/987f6f8c-d8bd-41f0-95d0-43be634e3bf2). If the build storage link has expired, please go to [https://projects-jglchen.vercel.app/en/contact](https://projects-jglchen.vercel.app/en/contact) to request build files.


![react-native-firebase-auth-screenshot](/images/react-native-firebase-auth-screenshot.png)

### [iOS Simulator Build](https://expo.dev/accounts/jglchen/projects/firebase-auth/builds/da8ba431-1739-4dd2-8735-2a2a65836d18)
### [Android Internal Distribution Build](https://expo.dev/accounts/jglchen/projects/firebase-auth/builds/987f6f8c-d8bd-41f0-95d0-43be634e3bf2)
### [React Native GitHub](https://github.com/jglchen/react-native-firebase-auth)
### [View the Web Demo](https://firebase-auth-rust.vercel.app)
### [React GitHub](https://github.com/jglchen/firebase-auth)
### Docker: docker run -p 3000:3000 jglchen/firebase-auth
### back To [Series Home](https://jglchen.github.io/)

{% include giscus.html %}
