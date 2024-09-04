# Security

Ensuring the security of your application is paramount. This document outlines the security measures implemented in this project, including authentication, authorization, encryption, hashing, and various HTTP security headers.

---

[[toc]]

## Authentication

Authentication is the process of verifying the identity of a user or system. This project uses [SuperTokens](https://supertokens.com/) OAuth2 for session. Users are required to log in with their credentials or Social, after which they receive a token that must be included in the header of subsequent requests.
Refer to [Supertokents Documentation](https://supertokens.com/docs/guides) for mor details

## Authorization

Authorization is the process of determining if a user has permission to perform a certain action or access a specific resource. This project implements role-based access control (RBAC) to manage user permissions. Each user is assigned one or more roles, and each role is associated with a set of permissions.