import React, { useState } from 'react';
import { Element, Stack, Text } from '@codesandbox/components';
import styled from 'styled-components';

export const FAQ = () => {
  return (
    <Stack direction="vertical">
      <Element css={{ textAlign: 'center', color: '#e5e5e5' }}>
        <Text weight="medium" fontFamily="everett" size={7}>
          {content.title}
        </Text>
      </Element>

      <Element css={{ marginTop: '48px' }}>
        {content.data.map((faq, index) => (
          <FaqItem
            open={index === 0}
            key={faq.question}
            question={faq.question}
            answer={faq.answer}
          />
        ))}
      </Element>
    </Stack>
  );
};

const FaqItem = ({ question, answer, open }) => {
  const [isOpen, setIsOpen] = useState(open);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <FaqContainer data-open={isOpen} direction="vertical">
      <Question onClick={toggleOpen}>
        {question}

        <span>
          <svg
            width="20"
            height="21"
            viewBox="0 0 24 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M5.96967 1.96967C6.26256 1.67678 6.73744 1.67678 7.03033 1.96967L16.5 11.4393C17.0858 12.0251 17.0858 12.9749 16.5 13.5607L7.03033 23.0303C6.73744 23.3232 6.26256 23.3232 5.96967 23.0303C5.67678 22.7375 5.67678 22.2626 5.96967 21.9697L15.4394 12.5L5.96967 3.03033C5.67678 2.73744 5.67678 2.26256 5.96967 1.96967Z"
              fill="currentColor"
            />
          </svg>
        </span>
      </Question>

      {isOpen && (
        <Element css={{ padding: '0 16px 24px 16px' }}>
          {answer.split('\n').map(line => {
            return (
              <Text
                dangerouslySetInnerHTML={{ __html: line }}
                key={line}
                as="p"
                css={{
                  display: 'block',
                  color: '#858585',
                  a: {
                    color: '#DCFF50',
                    textDecoration: 'underline',
                    '&:hover': {
                      textDecoration: 'none',
                    },
                  },
                }}
              />
            );
          })}
        </Element>
      )}
    </FaqContainer>
  );
};

const FaqContainer = styled(Stack)`
  display: flex;
  max-width: 800px;
  margin: 0 auto;
  border-top: 1px solid #252525;

  svg {
    color: #e5e5e5;
    transform: rotate(90deg) translate3D(6px, 0, 0);
    transition: transform 150ms ease-in-out;
  }

  &[data-open='true'] svg {
    transform: rotate(-90deg);
  }

  &:last-child {
    border-bottom: 1px solid #252525;
  }
`;

const Question = styled('button')`
  text-align: left;
  font-size: 24px;
  padding: 24px 16px;
  background: none;
  border: none;
  display: flex;
  justify-content: space-between;
  cursor: pointer;
  transition: background 150ms ease-in-out;
  color: #e5e5e5;
`;

const content = {
  title: 'Frequently asked questions',
  data: [
    {
      question:
        'How much do credits cost and how can I add more to my workspace?',
      answer: `VM credits are only used on Devboxes and repositories, to translate virtual machine (VM) runtime per hour into precise costs. They are priced at $0.015 each.
        
        You can conveniently purchase credits as add-ons to your base package. Adding more credits is a breeze. From your workspace dashboard, go to the settings and navigate to billing. You'll find the option to add to or upgrade your plan effortlessly.`,
    },
    {
      question: 'What is the ideal plan for my team size?',
      answer: `The base Pro plan includes up to 40 hours of runtime per month in our Nano VMs (2 vCPU + 4 GB RAM), which is an excellent place to start if you're an individual developer or a small team.
  
        If you have a larger team or require additional VM usage, you can either rely on on-demand credits ($0.015/credit) or purchase a discounted add-on package of VM credits.
        
        For example, a team with 7 collaborators, each using 2 hours of VM runtime per day on our default VM size (Micro) would require 8400 credits. The 7400 credits required on top of the 1000 included in the base Pro plan can be obtained either on-demand or by purchasing two add-on packages of 4000 VM credits each.`,
    },
    {
      question: 'Can I define a spending limit for credits?',
      answer: `Yes, when you start a subscription, you will be asked to add a spending limit for the workspaces so there are no unexpected surprises.`,
    },
    {
      question:
        'Do I use credits if someone runs my public Devbox/Repository? And will I continue to be billed for credits after hitting the limit?',
      answer: `Devbox and repository usage will be billed regardless of who runs the VM. Once you hit your spending limit, it will go into a frozen state and your billing won’t go over because no one will be able to run the Devbox.`,
    },
    {
      question:
        'What will happen when I hit my workspace member limit on a Pro plan? Will I have the option to pay for more members individually?',
      answer:
        'If you hit the workspace member limit, please reach out to our <a href=https://www.together.ai/contact-sales>sales team</a> to discuss a custom plan to suit your needs.',
    },
    {
      question: 'My Sandbox is frozen. What does that mean?',
      answer: `In VM Sandboxes and repositories, the VM will become frozen if the workspace does not have enough available credits to run a VM. You may encounter a frozen state if:
            - you are on a Free workspace and have run out of credits;
            - you are on a Pro workspace but your credit spend has hit the spending limit.
        
        To get out of the frozen state, you can either <a href=/upgrade>upgrade</a> to Pro (if you are on Free) or adjust your spending limit. Otherwise, you must wait until the start of the next billing cycle for your credits to renew.`,
    },
    {
      question: 'What is your cancelation and refund policy?',
      answer: `If you want to stop your Pro plan, you can do this anytime through the Pro workspace settings. Please be aware that subscriptions are linked to workspaces rather than accounts. If you have multiple workspaces with subscriptions, you'll need to cancel them individually. Charges will cease after the current billing cycle once all subscriptions are canceled via the billing page of each workspace.
  
        Refunds are available for a period of 14 days after payment if you are based in the EU or Turkey. If you are based elsewhere, we won’t be able to refund your subscription. Please be aware that we will not be able to offer a refund within this period in the following circumstances:
              - If your workspace has used Small, Medium, Large or XLarge VMs.
              - If your workspace has used more than the free allowance of 400 credits.
              - If your workspace has purchased a credit add-on.
              - If your workspace has, or has had more than 5 members in the current billing cycle.
        
        Note that credit add-ons are non-refundable.
        
        If you have any questions, please contact our <a href=mailto:support@codesandbox.io>Support team</a>.`,
    },
  ],
};
