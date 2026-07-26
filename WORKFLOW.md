# AI-Assisted Development Workflow Comparison

I conducted two experiments where I had compared two independent implementations of the `ThinkLens Decision Setup Form`.
In Round 1 I used a very vague prompt of one line `Build a decision setup form for the ThinkLens project.`, while in Round 2 I used a very precise prompt with all requirements, constraints, file references ,examples and all verification expectations.

Round 1 took approximately 6 minutes and 38 seconds for the AI to generate the implementation. Round 2 took approximately 14 seconds to generate its implementation. However, as we know, speed did not determine the quality of the result. Round 1 took more time to test because it had many additional functionalities such as deadline field, past-deadline validation, and localStorage-based draft saving and restoring.

Moreover, the branch comparison showed significant implementation differences difference. The output of the git diff command revealed 572 insertions and 767 deletions across the three implementation files. As I mentioned above  Round 1 contained deadline validation, past-deadline validation and localStorage operations including `setItem`, `getItem`, and `removeItem`; that were absent in Round 2. This demonstrated that the vague prompt led the AI to independently expand the feature scope, while the precise prompt produced a more focused implementation.

During testing, both implementations passed the core tests, including empty-form validation, minimum options, dynamic option handling, criteria handling, and valid submission. The Round 2 implementation did not include the deadline or draft-saving features from Round 1, but these were outside the explicitly defined Round 2 scope rather than failures of its required functionality.

The experiment also demonstrated that AI output requires verification. The AI described the generated form as ready. However, manual testing was still necessary to verify the actual behavior and features and to identify differences between the implementation and the expected functionality.
This was the most important mistake caught: accepting an AI completion message without independently checking the implementation would have produced an inaccurate assessment.

In a nutshell, the precise prompt required more preparation but created a clearer implementation boundary and made the result easier to evaluate against explicit requirements. In future work, I will use an explore-plan-code-verify workflow: define requirements and constraints, inspect the relevant files, implement the feature, test valid and invalid behavior, review the diff, and only then consider the task complete.
