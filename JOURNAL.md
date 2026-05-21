# What aspect of Chunk 1's work did you find the most difficult?

It would be understanding IAM and OIDC authentication properly when trying to automate deployments from GitLab CI/CD to AWS. At first, I thought CI/CD was simply "push code and deploy automatically," but while building the project I realized there were many security concepts happening behind the scenes.

The hardest thing for me was understanding the relationship between GitLab, JWT tokens, AWS STS, IAM trust policies, and temporary credentials. Initially, I did not understand:

- the difference between IAM trust policies and permission policies
- why OIDC uses `sts:AssumeRoleWithWebIdentity` instead of `sts:AssumeRole`
- what the `aud` and `sub` claims inside the GitLab JWT token actually meant
- how GitLab CI/CD jobs can securely deploy to AWS without storing long-lived AWS access keys

One major issue I faced was writing the Terraform trust policy incorrectly because I mixed JSON syntax with Terraform HCL syntax. I originally tried writing the condition block like raw JSON inside Terraform, which caused validation and parsing problems. Later, I learned that Terraform's `aws_iam_policy_document` data source uses its own HCL structure such as:

```hcl
condition {
  test     = "StringEquals"
  variable = "gitlab.com:sub"
  values   = ["project_path:h4w1/cloudresumechallenge-haw:ref_type:branch:ref:main"]
}
```

That mistake helped me better understand the difference between raw IAM JSON policies and Terraform abstractions.

Another thing I struggled with was understanding the `sub` condition format itself. At first, I incorrectly used the GitLab repository URL directly inside the condition. After reading the GitLab OIDC documentation more carefully, I realized the `sub` claim follows a very specific structure:

```
project_path:h4w1/cloudresumechallenge-haw:ref_type:branch:ref:main
```
This helped me understand how AWS restricts role assumption so that only my specific GitLab repository and branch can deploy infrastructure. That was the moment OIDC security finally "clicked" for me.

I also learned that modern CI/CD pipelines use temporary credentials through OIDC instead of static AWS access keys because it is more secure and follows least-privilege principles. Before this project, I had seen people store AWS keys in CI/CD secrets, but I did not understand why OIDC was becoming the preferred industry approach until I implemented it myself.

The other concept that took time to settle was the difference between trust policies and permission policies. They both look like JSON policy documents, but they answer two completely different questions. The trust policy decides *who can assume this role*. The permission policy decides *what the role can do once assumed*. Both have to pass for a deployment to succeed. When I finally understood that, the whole IAM model started making sense instead of feeling like a pile of similar-looking JSON.

One thing I intentionally tried to do throughout this project was avoid blindly copying tutorials. Many times I wanted to just paste working code, but instead I spent more time reading documentation, debugging Terraform errors, and understanding why the configuration worked. That process was slower and sometimes frustrating, but it gave me a much deeper understanding of cloud security and real-world DevOps practices.

Some references and documentation I used heavily during this process were:

- [GitLab OIDC AWS Documentation](https://docs.gitlab.com/ci/cloud_services/aws)
- [Terraform AWS Provider Documentation](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [AWS IAM OIDC Federation Documentation](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_providers_create_oidc.html)
- [Terraform aws_iam_policy_document Documentation](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document)


# Note one or two problems you overcame to get the static site deployed; include the error messages or screenshots of the issues, and write down what you did to fix them.

## Problem 1: Wrong MIME types from uploading via Terraform

One mistake I made while deploying the static site was trying to upload the Next.js `out/` build files to S3 entirely using Terraform resources such as `aws_s3_object`.

At first, I thought it would be a good idea because I wanted Terraform to manage everything, including the website files themselves. I used a `for_each` loop together with `fileset()` to upload all the generated files from the `out/` directory into the S3 bucket.

However, after deploying the site, many parts of the website did not load correctly. Some pages downloaded as files instead of rendering in the browser, while CSS and JavaScript assets were missing or broken.

After troubleshooting, I realized the issue was related to incorrect `Content-Type` metadata being assigned to the uploaded files. Since Terraform's `aws_s3_object` resource does not automatically detect MIME types, S3 was serving files with incorrect content types such as:

```text
binary/octet-stream
```

instead of:
- `text/html`
- `text/css`
- `application/javascript`

Because of that, browsers could not properly interpret the website assets.

At first, I thought something was wrong with Next.js or S3 static hosting itself, but eventually I learned the problem was caused by how the files were uploaded. Silly mistake, but it taught me an important lesson about separating infrastructure management from application deployment.

To fix the issue, I stopped using Terraform to upload the website build files and switched to using the AWS CLI instead:

```bash
aws s3 sync ./out s3://h4wops.com/ --delete
```

The AWS CLI automatically handles MIME type detection correctly, which immediately fixed the rendering problems.

After that, instead of manually running the command from my laptop every time, I integrated the deployment into my GitLab CI/CD pipeline. The pipeline now:
- builds the Next.js project
- generates the `out/` folder
- authenticates to AWS using GitLab OIDC
- automatically syncs the static files to the S3 bucket using AWS CLI

This helped me better understand the difference between:
- infrastructure provisioning (Terraform)
- application deployment (CI/CD pipeline)

It also taught me an important real-world DevOps concept: even though infrastructure and application deployments are related, they are often handled separately using different tools designed for different responsibilities.

## Problem 2: GitLab CI failing on an empty OIDC token

The first time I pushed my `.gitlab-ci.yml`, the pipeline failed with this error in the deploy job:

```text
aws: [ERROR]: An error occurred (ParamValidation): Parameter validation failed:
Invalid length for parameter WebIdentityToken, value: 1, valid min length: 4
```

At first I had no idea what was happening. The error said the token was 1 character long, but I expected GitLab to inject a full JWT (which is hundreds of characters). My OIDC setup looked correct, my IAM role looked correct, but somehow the token wasn't getting through.

The fix came from adding a debug line that printed the actual token length:

```yaml
- echo "$AWS_TOKEN" > /tmp/oidc_token
- echo "Token length: $(wc -c < /tmp/oidc_token)"
```

That confirmed the file was basically empty. Then I realized the problem: in my `id_tokens` block I had declared the token as `aws_token` (lowercase), but my script was reading `$AWS_TOKEN` (uppercase). GitLab's case-sensitivity behavior is fuzzy and depends on the version, so the env var ended up unset, and `echo "$AWS_TOKEN"` just wrote a newline to the file.

Fix was a one-character change — uppercase the token name in `id_tokens` so both sides match:

```yaml
id_tokens:
  AWS_TOKEN:
    aud: https://gitlab.com
```

Pipeline went green on the next push.

The lesson I took from this: when something in CI fails in a weird way, don't guess — add a debug line that prints the actual state. `wc -c` to check token length, `aws sts get-caller-identity` to confirm authentication, `ls -la` to verify file existence. CI logs are the only window I have into what's happening on the runner, so I have to make sure I'm capturing useful information.


# What's something you'd have done differently, or added, if you'd had more time?

If I had more time, the biggest thing I would change is setting up remote Terraform state from the start instead of letting it live on my laptop. Mid-project I almost committed `terraform.tfstate` to git because my `.gitignore` didn't catch it in time, and I had to wipe my GitLab repo and start over to avoid leaking AWS resource details. A remote backend like HCP Terraform or an S3 + DynamoDB setup would have removed that risk entirely, and would also have prepared me for running Terraform from CI later in Chunk 4.

Instead of deploying directly from `main` to a single environment, I would also have liked to set up multi-environment deployments, separate `dev` and `prod` environments with their own infrastructure. Right now my pipeline goes straight from commit to live site. That's fine for a portfolio, but it's not how real teams ship anything that matters.

Other things I would have added:

- An AWS budget alert before creating any resources, so I'd know immediately if something unexpected started costing money
- GitLab CI/CD stages for `plan`, `apply`, and deployment approvals instead of a single deploy job
- Automated smoke tests after deployment (a quick HTTP check that the site returns 200)
- CloudWatch alarms for the CDN: error rate, cache hit ratio, that kind of thing
- A CloudFront Function to handle trailing-slash routing for Next.js subpages, since CloudFront + S3 REST endpoint doesn't handle that automatically the way S3 website hosting does

One thing this project taught me is that real-world cloud projects evolve gradually. At the beginning, I mainly focused on "making it work," but as I learned more about Terraform, IAM, and CI/CD design patterns, I started thinking more about maintainability, scalability, and security. The instinct to keep adding monitoring, environment separation, and review gates didn't come from a tutorial, but it came from actually building the thing and noticing where it would break under more serious conditions.


# If you tried one or more of the project mods (Developer, DevOps, Security, or Solutions Architect), describe: What you did, Why you chose that mod, And how it deepened your understanding of real-world cloud skills.

I focused on the DevOps mod because I wanted to build stronger cloud infrastructure and CI/CD skills instead of only deploying a static website manually.

## What I did

For the DevOps portion, I used Terraform to provision and manage AWS infrastructure instead of configuring resources manually through the AWS console. I created and configured:

- The S3 bucket for static hosting
- IAM roles and trust policies for CI/CD authentication
- GitLab OIDC integration with AWS IAM
- CloudFront distribution with Origin Access Control
- ACM certificate with DNS validation for `htooaungwin.com`
- Route 53 alias records pointing apex and www at CloudFront
- A locked-down bucket policy that only allows CloudFront to read

I also integrated GitLab CI/CD into the deployment workflow. Instead of manually uploading files to S3, the pipeline now:

- builds the Next.js project
- generates the static `out/` directory
- authenticates to AWS using OIDC (no stored access keys)
- deploys the files automatically using `aws s3 sync`

The end result is that pushing to `main` automatically rebuilds and deploys the site to `https://htooaungwin.com`, with HTTPS terminated at CloudFront and the S3 bucket completely private behind it.

## Why DevOps

I chose the DevOps mod because I wanted to learn the real-world workflow behind infrastructure automation and secure cloud deployments. While building the project, I realized modern DevOps is not only about automation, but also about understanding:

- infrastructure-as-code
- CI/CD pipelines
- IAM security and federated authentication
- cloud architecture and separation of concerns
- deployment safety (least-privilege, no long-lived credentials)
- separation between infrastructure provisioning and application deployment

## How it deepened my understanding

The OIDC piece deepened my understanding the most. Before this project, I had only seen CI/CD pipelines using static AWS access keys stored as secrets. Through this project, I learned how modern pipelines use temporary credentials with JWT tokens, AWS STS, `sts:AssumeRoleWithWebIdentity`, and IAM trust policies with `aud` and `sub` conditions. This helped me understand how cloud providers securely allow CI/CD systems to access infrastructure without exposing long-lived credentials.

The other thing that deepened my understanding was migrating from a public S3 bucket to CloudFront-in-front-of-private-S3. When I first deployed the site, the S3 bucket was public so anyone could read from it directly. That worked, but it's not how real production sites are set up. Putting CloudFront in front and locking the bucket down to allow only CloudFront access via Origin Access Control and a bucket policy scoped to my specific distribution ARN was a real security improvement. It also meant I could provide HTTPS on a custom domain, which wasn't possible with the S3 website endpoint alone.

I also hit a real Terraform state-drift situation halfway through the project. After restructuring my repo, my state file lost track of three IAM resources, and Terraform tried to recreate them but AWS rejected the creates because the resources already existed. Instead of destroying and recreating everything to "fix" it, I used `terraform import` to reconcile state with reality. That experience taught me something important: in real infrastructure work, state and reality drift apart constantly, and the right move is almost always to bring state back in line, not to destroy production resources to make the tool happy.

Another thing I learned was that Terraform and deployment tools serve different purposes. Initially, I tried uploading the Next.js `out/` files directly using Terraform resources, but I ran into issues with incorrect MIME content types. After troubleshooting, I switched to using `aws s3 sync` inside the GitLab pipeline, which taught me an important DevOps principle: infrastructure management and application deployment are usually handled separately even though they work together closely.