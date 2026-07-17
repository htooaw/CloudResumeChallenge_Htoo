# CHUNK1
### What aspect of Chunk 1's work did you find the most difficult?

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


### Note one or two problems you overcame to get the static site deployed; include the error messages or screenshots of the issues, and write down what you did to fix them.

#### Problem 1: Wrong MIME types from uploading via Terraform

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

#### Problem 2: GitLab CI failing on an empty OIDC token

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


### If you tried one or more of the project mods (Developer, DevOps, Security, or Solutions Architect), describe: What you did, Why you chose that mod, And how it deepened your understanding of real-world cloud skills.

I focused on the DevOps mod because I wanted to build stronger cloud infrastructure and CI/CD skills instead of only deploying a static website manually.

#### What I did

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

#### Why DevOps

I chose the DevOps mod because I wanted to learn the real-world workflow behind infrastructure automation and secure cloud deployments. While building the project, I realized modern DevOps is not only about automation, but also about understanding:

- infrastructure-as-code
- CI/CD pipelines
- IAM security and federated authentication
- cloud architecture and separation of concerns
- deployment safety (least-privilege, no long-lived credentials)
- separation between infrastructure provisioning and application deployment

#### How it deepened my understanding

The OIDC piece deepened my understanding the most. Before this project, I had only seen CI/CD pipelines using static AWS access keys stored as secrets. Through this project, I learned how modern pipelines use temporary credentials with JWT tokens, AWS STS, `sts:AssumeRoleWithWebIdentity`, and IAM trust policies with `aud` and `sub` conditions. This helped me understand how cloud providers securely allow CI/CD systems to access infrastructure without exposing long-lived credentials.

The other thing that deepened my understanding was migrating from a public S3 bucket to CloudFront-in-front-of-private-S3. When I first deployed the site, the S3 bucket was public so anyone could read from it directly. That worked, but it's not how real production sites are set up. Putting CloudFront in front and locking the bucket down to allow only CloudFront access via Origin Access Control and a bucket policy scoped to my specific distribution ARN was a real security improvement. It also meant I could provide HTTPS on a custom domain, which wasn't possible with the S3 website endpoint alone.

I also hit a real Terraform state-drift situation halfway through the project. After restructuring my repo, my state file lost track of three IAM resources, and Terraform tried to recreate them but AWS rejected the creates because the resources already existed. Instead of destroying and recreating everything to "fix" it, I used `terraform import` to reconcile state with reality. That experience taught me something important: in real infrastructure work, state and reality drift apart constantly, and the right move is almost always to bring state back in line, not to destroy production resources to make the tool happy.

Another thing I learned was that Terraform and deployment tools serve different purposes. Initially, I tried uploading the Next.js `out/` files directly using Terraform resources, but I ran into issues with incorrect MIME content types. After troubleshooting, I switched to using `aws s3 sync` inside the GitLab pipeline, which taught me an important DevOps principle: infrastructure management and application deployment are usually handled separately even though they work together closely.

# CHUNK1
### What aspect of Chunk 2's work did you find the most difficult?


The hardest part was understanding how the *layers* of a serverless backend connect, and what each one is responsible for. Coming from the SAA cert, I knew what Lambda, DynamoDB, API Gateway, and SNS were on paper. Actually wiring them together end-to-end in Terraform forced me to think about

- How does API Gateway *actually* invoke Lambda? (Answer: through a resource policy on the Lambda — `aws_lambda_permission` — that explicitly allows the API Gateway service principal. Without it, API Gateway gets 403'd by the Lambda.)
- Why does my Lambda's IAM role need *two* policies attached — one for DynamoDB and one for CloudWatch Logs? (Two different concerns, two different scopes. The AWS-managed `AWSLambdaBasicExecutionRole` handles logging; my custom policy handles the DynamoDB-specific access.)
- What's the actual difference between `client` and `resource` in boto3, and which one should I use? (Resource is higher-level and friendlier for simple work; client is verbose but mirrors the AWS API exactly. Used `resource` for DynamoDB in my visitor counter Lambda.)

The other thing that took time was thinking in terms of *atomic operations* in DynamoDB. My first instinct was to write the Lambda as "read count, add 1, write count" three operations. That works, but it's a race condition: two visitors hitting the API at the same time could both read the same count and both write `count+1`, losing an increment. DynamoDB's `UpdateExpression` with the `ADD` operator does this atomically in a single API call. Concurrency isn't something I thought about much before — this was a small but real introduction.


### Note one or two problems you overcame to get the cloud function talking to your database — with error messages and how you fixed them

#### Problem 1: Lambda import error — `No module named 'lambda_function'`

The first time I deployed my Lambda and ran the Test button in the AWS console, I got:
```bash
{
"errorMessage": "Unable to import module 'lambda_function': No module named 'lambda_function'",
"errorType": "Runtime.ImportModuleError"
}
```
My Terraform config was telling Lambda the handler was at `lambda_function.lambda_handler`, but Lambda couldn't find that module in the zip.I started by `unzip -l`'ing the deployed zip locally:
```bash
infra/visitor_count_lambda.zip
└── lamba_function.py
```
The filename was `lamba_function.py`, not `lambda_function.py`. I'd typo'd the filename, missing the `d` in "lambda" :) and never noticed because everything *looked* right until Lambda actually tried to import it. Fix was a one-line rename:

```bash
mv lambda/visitor_count/lamba_function.py lambda/visitor_count/lambda_function.py
```

Then `terraform apply` rebuilt the zip with the correct filename, and the Lambda imported fine.

Lessons:
- The error message was very specific and pointed at exactly the problem (`No module named 'lambda_function'`). Reading error messages carefully matters.
- The `unzip -l` command was the diagnostic that cracked it. When packaging seems wrong, look at the actual artifact, not at the source.
- Easy typos in filenames are invisible until something specific tries to use that exact name. Lint and IDE checks didn't catch this because the filename only matters at the Lambda runtime layer.

#### Problem 2: ChatOps notifier sending the wrong payload to Slack

When I built the SNS → notifier Lambda → Slack integration, my first version POSTed the raw CloudWatch alarm JSON straight to Slack:

```python
sns_message = json.loads(event['Records'][0]['Sns']['Message'])
alarm = json.dumps(sns_message).encode('utf-8')  # re-encoded the alarm JSON
req = urllib.request.Request(webhook_url, data=alarm, ...)
```

Slack's incoming webhook rejected it. The alarm dict looks like `{"AlarmName": "...", "NewStateValue": "ALARM", ...}`  but Slack expects its own message format like `{"text": "..."}`. I'd conflated the *input* (the alarm) with the *output* (what Slack wants).

Fix: build a Slack-shaped payload from the alarm fields:

```python
sns_message = json.loads(event['Records'][0]['Sns']['Message'])
slack_payload = {
    "text": f"🚨 *{sns_message['AlarmName']}* is in state *{sns_message['NewStateValue']}*\n{sns_message['NewStateReason']}"
}
data = json.dumps(slack_payload).encode('utf-8')
urllib.request.urlopen(urllib.request.Request(webhook_url, data=data, ...))
```

I also caught (with help) that I'd built the `Request` object but forgotten to call `urlopen()` on it. The function was running, parsing the alarm, building the payload, and then silently exiting without ever talking to Slack. Stdlib `urllib` makes this easy to miss because building the request and sending it are two separate calls, unlike `requests.post()` in higher-level libraries.

### Did you implement one of the mods? What did you choose and what did you learn?

I did the DevOps Mod (Monitor Lizard)  both parts.

#### What I did

**Part 1 — Metrics and alarms:** I picked 5 CloudWatch metrics to alarm on:

- Lambda Errors — function-level crashes
- Lambda Duration — performance regression early warning
- Lambda Invocations — DDoS or popularity spike
- API Gateway 5xx — visitor-facing failures (catches things Lambda errors might miss)
- API Gateway 4xx — bad request probing (could indicate reconnaissance)

Each one is a separate `aws_cloudwatch_metric_alarm` in Terraform, wired to an SNS topic via `alarm_actions`.

**Part 2 — ChatOps:** I built the full chain from alarm → SNS → notifier Lambda → Slack webhook. The notifier Lambda fetches its Slack webhook URL from AWS Systems Manager Parameter Store (as a `SecureString`) so the URL isn't hardcoded in source or Terraform. The Lambda parses the SNS message, extracts alarm fields, and POSTs a formatted message to a Slack channel via webhook.

To test the chain, I deliberately broke my visitor-counter Lambda by adding `raise Exception("test")` at the top of the handler, hit the API once, and watched the alarm fire and the Slack message arrive about a minute later. Then reverted the broken code.

#### Why DevOps

Same reason as Chunk 1: I'm targeting cloud/devops roles, and monitoring is a daily-bread skill in those jobs. "Built a Lambda that increments a counter" is a tutorial. "Built a Lambda with five CloudWatch alarms, SNS notification, and a custom ChatOps integration via Slack webhook, with secrets in Parameter Store" is the kind of thing a small team would actually run.

#### How it deepened my understanding

The biggest lesson was *thinking about what matters to alert on*. The book gave example metrics; I had to decide which 3-5 made sense for my specific service. That's not a technical exercise. It's an architectural one. Threshold-picking was its own decision. For my low-traffic portfolio, "normal" is "near-zero traffic," which means *any* alarm condition is somewhat anomalous. I went strict on errors (alarm at >= 1) and looser on 4xx (alarm at >= 10) since occasional 4xx from probing is normal. Those reasoning trails are what an interviewer would actually probe.

The other thing I learned was Parameter Store as a real piece of devops infrastructure. Before this project, I'd vaguely heard of it but never used it. The pattern of "Terraform creates an SSM parameter as `SecureString`, your Lambda's IAM role grants `ssm:GetParameter`, your Lambda code fetches it at module-load time" is super common anywhere you have third-party credentials (API keys, webhooks, OAuth secrets) that aren't AWS-native. Parameter Store is free; Secrets Manager does the same job but costs money for advanced features I don't need yet.

Side learning: I accidentally pasted my real Slack webhook URL into a chat while debugging. That was a credential leak. I rotated the credential immediately, create a new webhook, update `terraform.tfvars`, move on. 

### What's something you'd have done differently, or added, if you'd had more time?

The biggest thing I'd add is **CI/CD for the Lambda code**, not just for the static site. Right now my GitLab pipeline only deploys frontend changes (`aws s3 sync` of the static build). When I change Lambda code, I have to manually `terraform apply` from my laptop. That's fine for a one-person project, but in any real team the Lambda would have its own deploy pipeline probably running tests, packaging the zip, uploading, and updating the function version. This is partly Chunk 4 territory (multi-environment promotion), but even a single-environment Lambda deploy pipeline would be a meaningful step up.

Other things I'd add:

- **Unit tests for the Lambda code.** The book mentions tests in Chunk 3, I'd want to write `pytest` tests for the visitor counter Lambda using `moto` (a library that mocks AWS services in tests) so I could test the increment logic without hitting real DynamoDB.
- **Custom domain for the API.** Right now my API is at the ugly `<id>.execute-api.ap-southeast-1.amazonaws.com` URL. A custom subdomain like `api.htooaungwin.com` would be cleaner. Same pattern as the portfolio domain, ACM cert + API Gateway custom domain mapping + Route 53 record.
- **Better alarm thresholds based on real traffic.** Right now my thresholds are guesses. Once the site has some baseline traffic, I'd look at actual CloudWatch metrics and tune the alarms accordingly. Real teams iterate on alarm thresholds based on signal-to-noise ratio.
- **Structured logging in the Lambda.** Right now if the Lambda errors, I see a Python stack trace in CloudWatch. Better would be structured JSON logs with consistent fields (`request_id`, `error_type`, `duration_ms`, etc.) that I could query with CloudWatch Insights. Modern logging hygiene.


# CHUNK 3

### What aspect of Chunk 3's work did you find the most difficult?
Easily the React component. I'd done a little JavaScript before, but never React, never hooks, never TypeScript. Writing a `<VisitorCount />` component that fetches from my API and shows the result sounds simple in plain English and it is, once you know the pattern. Getting there from zero took longer than I expected.

The mental model that took a while to click: a React component renders *once* with the initial state (in my case, `count = null`), then `useEffect` fires *after* the render, then the fetch happens, then state updates, then the component re-renders with the new value. That's a lot of asynchronous choreography for what looks like one small widget. Coming from Python and Terraform, both of which run top to bottom, React's "everything is reactive" model felt backwards.


A couple of specific things I got hung up on:
- **`'use client'` at the top of the file.** Next.js App Router defaults to server components, where `useState` and `useEffect` don't work. The error wasn't obvious. I had to read about server vs client components to understand why I needed that directive.
- **CORS during local testing.** When I ran `npm run dev` and opened `localhost:3000`, the fetch silently failed and the counter said "Loading..." forever. The browser console showed a CORS error. My API Gateway only allowed `https://htooaungwin.com` as an origin, which is correct for production but blocks local testing. I decided not to add `localhost:3000` to the CORS list — the component code was clearly right, and I'd see the real number once it deployed.

The Python tests were less conceptually new but had their own surprise. My Lambda creates the DynamoDB resource at module level (`dynamodb = boto3.resource('dynamodb')` outside the handler which is a cold-start optimization). When I tried to test it with `moto`, the import happened *before* the mock was active, so the boto3 client connected to real AWS. The fix was importing `lambda_function` inside each test function, after `mock_aws` was active. It works but feels brittle. The cleaner solution would be refactoring the Lambda to lazy-init the client, but that's changing production code to make testing easier, which has its own tradeoffs.

The Browser Up mod was the most fun part for me, but I tripped on something dumb at the start: I imported `process` from `@playwright/test` along with `test` and `expect`, because my editor's autocomplete suggested it. `process` is a Node.js global, not a Playwright export, so `process.env.SITE_URL` ended up reading `undefined.env`, which threw. The fix was to remove `, process` from the import but the error message ("Cannot read properties of undefined") didn't immediately point at the import. I learned to read import statements carefully when something basic breaks for no obvious reason.

### Note one or two problems you overcame to get the front end and back end working together; include the error messages or screenshots of the issues, and write down what you did to fix them.

#### Problem 1: Pytest tests all passing, but secretly hitting real AWS

The first version of my pytest setup ran "green" the first time. All three tests passed. I was about to commit, then noticed something off: the tests felt too fast on cold start but suspiciously identical to what would happen if I were hitting real DynamoDB. So I checked the AWS console and saw my real `crc_visitor_count` table's count had jumped by 3.

What had happened: my Lambda's `boto3.resource('dynamodb')` runs at module import time, *before* the `mock_aws` decorator activates in the test. So when I did `from lambda_function import lambda_handler` at the *top* of my test file, the real boto3 client got created against real AWS. Every test then incremented the real production counter.

The fix is to move the import inside each test function, after the `mock_aws` context is entered:

```python
def test_happy_path(dynamodb_table):
    from lambda_function import lambda_handler  # import here, not at top
    response = lambda_handler({}, None)
    ...
```

This is ugly having imports inside functions violates a basic Python convention but it works. The deeper fix would be refactoring `lambda_function.py` to create the boto3 client lazily inside the handler instead of at module level. I chose not to because:
1. The module-level pattern is a real Lambda optimization (cold start performance)
2. Changing production code to suit tests feels wrong

So I documented the import-inside-tests pattern as an intentional choice. Lesson: when tests "pass" too easily, look at what's actually happening. Real AWS calls during tests would have shown up in CloudTrail eventually, but only after they cost me real money or polluted my data.

#### Problem 2: Playwright test in the wrong folder, found no tests

After running `mkdir -p tests/browser` in the wrong directory, my Playwright setup ended up at `lambda/visitor_count/tests/browser/` instead of at the repo root. The first `npx playwright test` showed:
```
TypeError: Cannot read properties of undefined (reading 'env')
at visitor_count.spec.ts:3
...
Error: No tests found
```
Two bugs in one output: the `process` import issue (the TypeError) and the wrong folder location (the "No tests found"). The path in the error gave it away — `/lambda/visitor_count/tests/browser/visitor_count.spec.ts` is obviously not where browser tests for a deployed website should live.
Fix:

```bash
mv lambda/visitor_count/tests/browser tests/browser
```
Browser tests belong at the repo root, alongside `infra/`, `lambda/`, `portfolio/`. They test the *deployed system as a whole*, not anything specific to one component. Mixing them under `lambda/` was a category error on my part. I created the folder reflexively without thinking about where it logically belonged.

After moving them and fixing the import, all three tests passed against my live site.

### Did you implement one of the mods? Note which you chose and what you learned. How did you improve your project over the basic spec?

I did the Browser Up DevOps Mod. The base challenge asks for Python tests on the Lambda (which I did separately in `lambda/visitor_count/tests/`). Browser Up takes it further by automated browser tests that run in CI on every deploy, asserting the *live deployed site* actually works for visitors.

#### What I built

Three Playwright tests in `tests/browser/visitor_count.spec.ts`:

1. **Homepage loads** — basic sanity, returns a non-empty title
2. **Visitor counter shows a number** — uses a regex (`Visitor: \d+`) to assert the counter rendered with an actual digit, not "Loading..."
3. **No critical console errors** — listens for browser console errors, fails if any non-trivial errors occur

Tests run in a new `smoke_test` stage in `.gitlab-ci.yml`, after the `deploy` stage. The pipeline image is `mcr.microsoft.com/playwright:v1.50.0-jammy` — official Playwright Docker image with Chromium pre-installed, so I don't have to install browsers during CI runs.

#### Why this mod

Two reasons. First, "I have CI tests that verify my deployed site works" is a stronger interview story than "I have unit tests." Most candidates have one or the other; few have both. Second, smoke tests catch the kind of bug unit tests can't: a successful build that deploys broken JavaScript, a CORS misconfiguration that worked locally but breaks in production, a CloudFront cache serving stale content. Unit tests would all pass and the deploy would go green but real visitors would see a broken site.

#### How it deepened my understanding

The most important lesson came from *deliberately breaking* my site to verify the tests would catch the failure. I commented out the `<VisitorCount />` component in my Footer, pushed, and watched the smoke_test job go red. Then reverted and watched it go green.

This is a discipline I hadn't thought about before *testing the test*. A test that always passes is theater, not signal. The only way to trust a test is to see it fail on a real bug. I'd happily skipped this step in the past, assuming green checkmarks meant safety. Now I know to verify the negative case at least once, especially for new test infrastructure.

I also learned the layering of testing what unit tests catch, what smoke tests catch, and where each is appropriate. Unit tests are for *logic in isolation* does my function increment correctly given a specific input? Smoke tests are for *the system as a whole* — does the deployed site work for a real visitor? They're complementary; you can't replace one with the other. Real teams stack both, and my project now does too.

A side note about retries: I configured Playwright with `retries: 2`. Browser tests are inherently a bit flaky CDN cache misses, slow CloudFront propagation, transient network issues. Two retries means a test has to fail three times in a row before the pipeline goes red.

### What's something you'd have done differently, or added, if you'd had more time?

The biggest gap is that I don't have a `unit_test` stage in CI yet. My pytest tests run locally only and I have to remember to run them before committing. In any real project, those tests would run on every commit in CI, before the deploy job, so a broken Lambda can't reach production by accident. I have the tests; they just need a YAML job to invoke them. Maybe 10 minutes of work. I'll add this when I tackle Chunk 4's pipeline rework.

A few other things I'd add given more time:

- **Refactor the Lambda to lazy-init the boto3 client.** Would make the pytest setup cleaner — no more imports-inside-tests workaround. Tradeoff is slightly slower cold starts. For a portfolio it doesn't matter, but in a real service I'd think harder about which side to optimize for.
- **More Playwright assertions.** Right now I check the counter shows *a* number. I could also assert it *increments* between page loads (load page, read number, reload, assert new number is higher). Closer to a real user-facing smoke test.
- **Visual regression testing.** Playwright supports screenshot diffing, take a screenshot on every deploy, compare to a baseline, fail if anything visually changed unexpectedly. Catches CSS regressions that pure assertion-based tests miss. Overkill for a portfolio, but a real production team would use it.
- **Run smoke tests against a staging environment, not prod.** Right now my smoke tests hit `https://htooaungwin.com` directly — the same URL my visitors use. If a test load somehow corrupts the visitor counter (it wouldn't, since reads are idempotent, but in a more complex system…), it'd affect real users. The cleaner pattern is to deploy to staging first, smoke test against staging, then promote to prod. That's Chunk 4 territory.

