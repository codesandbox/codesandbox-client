import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState, useCallback } from 'react';
import styled, { css, keyframes } from 'styled-components';
import track from '@codesandbox/common/lib/utils/analytics';
import { Center, MainTitle, Wrapper, TermsAndUsage, Loading } from './elements';
import { SuccessStep } from './Success';

const host = process.env.CODESANDBOX_HOST;
const data = [
  {
    type: 'requirements',
    question: 'Where do you host your code?',
    icon: true,
    options: ['GitHub', 'GitLab', 'Bitbucket', 'Other'],
  },
  {
    type: 'requirements',
    question: 'Where do you run your code when developing?',
    options: [
      'Docker containers using docker-compose',
      'In Docker containers using Kubernetes',
      'Directly on my local machine',
      'In a self-hosted cloud',
    ],
  },
  {
    type: 'team_size',
    question: 'How many people are part of your team?',
    options: ['1 - 10', '11 - 50', '51 - 300', '300+'],
  },
];

const hints = 'abcdef';

export const Survey: React.FC<{ email: string }> = ({ email }) => {
  const [waitListId, setWaitListId] = useState();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({
    requirements: [],
    team_size: undefined,
    email,
  });
  const [state, setState] = useState<'LOADING' | 'COMPLETED' | 'UNCOMPLETED'>(
    'LOADING'
  );

  const onPickOption = useCallback(
    option => {
      const currentStep = data[step];

      setAnswers(prev => {
        const currentValue = prev[currentStep.type];
        const newValue = Array.isArray(currentValue)
          ? [...currentValue, option]
          : option;

        return {
          ...prev,
          [currentStep.type]: newValue,
          completed: step + 1 === data.length,
        };
      });

      setTimeout(handleNext, 1000);
    },
    [step]
  );

  const handleNext = () => {
    setStep(prev => {
      const newStepValue = prev + 1;
      const completed = newStepValue >= data.length;

      if (completed) {
        setState('COMPLETED');
        track('Waitlist - completed waitlist survey');

        return prev;
      }

      return newStepValue;
    });
  };

  useEffect(
    function pressHint() {
      const handle = ({ key }) => {
        const optionIndex = hints.indexOf(key);
        const currentStep = data[step];

        if (optionIndex > -1) {
          onPickOption(currentStep.options[optionIndex]);
        }
      };

      window.addEventListener('keydown', handle);

      return () => {
        window.removeEventListener('keydown', handle);
      };
    },
    [step, onPickOption]
  );

  useEffect(
    function submit() {
      if (!waitListId) {
        track('Waitlist - joined projects waitlist');
      }

      fetch(
        waitListId
          ? `${host}/api/beta/waitlist/${waitListId}`
          : `${host}/api/beta/waitlist`,
        {
          method: waitListId ? 'PUT' : 'POST',
          body: JSON.stringify(answers),
          headers: { 'Content-Type': 'application/json' },
        }
      )
        .then(payload => payload.json())
        .then(payload => {
          if (payload?.errors?.email?.includes('has already been taken')) {
            setState('COMPLETED');
          } else {
            setState('UNCOMPLETED');
            setWaitListId(payload.id);
          }
        })
        .catch(e => {
          if (process.env.NODE_ENV === 'development') {
            console.warn(e.message);
          }
        });
    },
    [answers, waitListId]
  );

  if (state === 'LOADING') {
    return <Loading />;
  }

  return (
    <Wrapper>
      <Center>
        <AnimatePresence>
          {state === 'COMPLETED' ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <SuccessStep />
            </motion.div>
          ) : (
            <motion.div exit={{ display: 'none' }}>
              <svg
                width="50"
                height="50"
                viewBox="0 0 50 50"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ marginBottom: 40 }}
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M0 50H50V0H0V50ZM44.8864 44.8864V5.11364H5.11364V44.8864H44.8864Z"
                  fill="white"
                />
              </svg>

              <SurveyContainer>
                <AnimatePresence>
                  <SurveyWrapperAnimated
                    key={data[step].question}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                  >
                    <MainTitle>{data[step].question}</MainTitle>

                    <Options>
                      {data[step].options.map((item, index) => {
                        const currentAnswer = answers[data[step].type];
                        const selected = Array.isArray(currentAnswer)
                          ? currentAnswer.findIndex(ans => ans === item) > -1
                          : currentAnswer === item;

                        return (
                          <Option
                            selected={selected}
                            type="button"
                            onClick={() => onPickOption(item)}
                            key={item}
                          >
                            <span>
                              {data[step].icon && iconOptions[item]} {item}{' '}
                            </span>
                            <span className="hint">{hints[index]}</span>
                          </Option>
                        );
                      })}
                    </Options>
                  </SurveyWrapperAnimated>
                </AnimatePresence>
              </SurveyContainer>

              <NavWrapper>
                <NavLink
                  disabled={step === 0}
                  onClick={() => setStep(prev => prev - 1)}
                  type="button"
                >
                  Back
                </NavLink>

                <NavLink onClick={handleNext} type="button">
                  Skip
                </NavLink>
              </NavWrapper>
            </motion.div>
          )}
        </AnimatePresence>
      </Center>

      <TermsAndUsage />
    </Wrapper>
  );
};

const SurveyContainer = styled.div`
  max-width: 540px;
  width: 100%;
  height: 370px;
  margin: 0 auto;
`;

const SurveyWrapperAnimated = styled(motion.div)`
  position: absolute;
  max-width: 540px;
  width: 100%;
`;

const Options = styled.div`
  margin: 50px auto 40px;

  max-width: 360px;
  width: 100%;
  min-height: 166px;
`;

const blink = keyframes`
  0%{
    background: #151515;
  }
  25% {
    background: #242424;
  }
  50% {
    background: #151515;
  }
  75% {
    background: #242424;
  }
  100% {
    background: #151515;
  }
`;

const Option = styled.button<{ selected: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;

  height: 40px;
  width: 100%;
  background: #151515;
  padding: 0 8px 0 12px;
  border-radius: 2px;

  border: 0;
  box-sizing: border-box;

  text-align: left;
  font-size: 14px;
  letter-spacing: -0.025em;
  color: #999999;
  margin: 0 auto 2px;
  cursor: pointer;

  transition: background 0.2s ease;

  svg {
    margin-right: 10px;
  }

  .hint {
    transition: background 0.2s ease;
    display: flex;
    justify-content: center;
    align-items: center;
    text-transform: uppercase;

    background: #2a2a2a;
    border-radius: 4px;
    width: 24px;
    height: 24px;

    font-size: 12px;
    line-height: 15px;
    text-align: center;
    letter-spacing: -0.025em;
    color: #999999;
  }

  ${({ selected }) => {
    return (
      selected &&
      css`
        animation: ${blink} 0.5s linear;
      `
    );
  }}

  &:hover {
    background: #2a2a2a;

    .hint {
      background: #373737;
    }
  }
`;

const NavWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  max-width: 360px;
  width: 100%;
  margin: 0 auto;
`;

const NavLink = styled.button`
  text-decoration: underline;
  color: #808080;
  background: none;
  border: 0;
  font-size: 10px;
  padding: 0;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
  }

  &:hover {
    text-decoration: none;
  }
`;

const iconOptions = {
  GitHub: (
    <svg
      width="16"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.02315 0C3.13701 0 0 3.21062 0 7.18795C0 10.3507 2.0133 13.0342 4.82256 13.9926C5.19713 14.0405 5.29077 13.8488 5.29077 13.6571V12.4112C3.32429 12.8425 2.9029 11.4528 2.9029 11.4528C2.57516 10.6382 2.10695 10.3986 2.10695 10.3986C1.45145 9.9673 2.15377 9.9673 2.15377 9.9673C2.85608 10.0152 3.23065 10.6861 3.23065 10.6861C3.83932 11.7882 4.86938 11.4528 5.29077 11.2611C5.33759 10.7819 5.52488 10.4944 5.75898 10.3027C4.21389 10.1111 2.57516 9.4881 2.57516 6.75668C2.57516 5.98996 2.85608 5.31909 3.27747 4.83989C3.18383 4.64821 2.94972 3.92942 3.32429 2.9231C3.32429 2.9231 3.93297 2.73142 5.24395 3.6419C5.80581 3.49814 6.41448 3.4023 7.02315 3.4023C7.63182 3.4023 8.2405 3.49814 8.80235 3.6419C10.1602 2.73142 10.722 2.9231 10.722 2.9231C11.0966 3.92942 10.8625 4.64821 10.7688 4.83989C11.237 5.31909 11.4711 5.98996 11.4711 6.75668C11.4711 9.53602 9.83241 10.1111 8.28732 10.3027C8.52142 10.5423 8.75553 10.9736 8.75553 11.6445V13.6092C8.75553 13.8009 8.89599 14.0405 9.22374 13.9446C12.033 12.9862 13.9995 10.3027 13.9995 7.14004C14.0463 3.21062 10.9093 0 7.02315 0Z"
        fill="#999999"
      />
    </svg>
  ),
  GitLab: (
    <svg
      width="16"
      height="14"
      viewBox="0 0 16 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15.7276 7.84216L14.9144 5.35938C14.9148 5.36049 14.9149 5.36165 14.9152 5.36277C14.9148 5.36148 14.9146 5.36018 14.9143 5.35889C14.9142 5.3588 14.9142 5.35875 14.9142 5.35866C14.9142 5.35862 14.9142 5.35857 14.9142 5.35857L13.2998 0.431603C13.2115 0.172037 12.9685 -0.00216834 12.6899 2.03905e-05C12.4105 0.00144977 12.1742 0.17226 12.0878 0.435399L10.5554 5.11205H5.72018L4.18493 0.435131C4.0986 0.17226 3.86226 0.00144977 3.58288 2.03905e-05C3.58176 2.03905e-05 3.58068 2.03905e-05 3.5795 2.03905e-05C3.30441 2.03905e-05 3.06095 0.173154 2.97169 0.435623L1.36173 5.35817L1.36151 5.3588C1.36151 5.35884 1.36151 5.35889 1.36151 5.35893C1.3611 5.36018 1.36092 5.36143 1.36052 5.36268C1.36088 5.36157 1.36101 5.3604 1.36137 5.35929L0.545153 7.84225C0.422364 8.21706 0.555606 8.62443 0.876795 8.85599L7.92439 13.932C7.92542 13.9328 7.92659 13.9332 7.92763 13.934C7.93065 13.9361 7.93358 13.9383 7.93664 13.9403C7.93376 13.9384 7.93105 13.9363 7.92822 13.9343C7.92822 13.9343 7.92822 13.9343 7.92817 13.9343C7.92862 13.9347 7.92916 13.9349 7.92966 13.9352C7.93006 13.9355 7.93047 13.9356 7.93088 13.9359C7.93092 13.9359 7.93097 13.936 7.93106 13.936C7.94196 13.9435 7.95327 13.9504 7.96499 13.9567C7.96661 13.9576 7.96805 13.9587 7.96967 13.9596C7.96972 13.9596 7.96972 13.9596 7.96976 13.9596C7.97075 13.9601 7.97165 13.9607 7.97265 13.9612C7.97341 13.9616 7.97422 13.9618 7.97494 13.9622C7.97548 13.9624 7.97607 13.9626 7.97661 13.9628C7.97792 13.9635 7.97936 13.9639 7.98067 13.9645C7.98679 13.9674 7.99324 13.9698 7.99955 13.9724C8.00545 13.9748 8.01117 13.9776 8.01721 13.9797C8.01748 13.9798 8.01771 13.9799 8.01798 13.98C8.01897 13.9803 8.01987 13.9808 8.02091 13.9812C8.02217 13.9816 8.02338 13.9821 8.02465 13.9825C8.02514 13.9827 8.02564 13.9828 8.02613 13.9829C8.02771 13.9834 8.02942 13.9836 8.031 13.9841C8.03158 13.9842 8.03226 13.9843 8.03289 13.9845C8.04136 13.987 8.05015 13.9889 8.05889 13.9908C8.06231 13.9916 8.0656 13.9926 8.06907 13.9933C8.06957 13.9933 8.07002 13.9935 8.07056 13.9936C8.07169 13.9938 8.07272 13.9942 8.0739 13.9944C8.07574 13.9947 8.07755 13.9953 8.07944 13.9956C8.08093 13.9958 8.08246 13.9957 8.08394 13.9959C8.08421 13.996 8.08444 13.9959 8.08471 13.996C8.0848 13.996 8.08485 13.996 8.08494 13.996C8.10156 13.9983 8.11842 14 8.13558 14C8.13567 14 8.13576 14 8.1359 14C8.13594 14 8.13599 14 8.13599 14H8.13603C8.13608 14 8.13612 14 8.13617 14C8.15338 14 8.17023 13.9983 8.18691 13.996C8.18695 13.996 8.18704 13.996 8.18709 13.996C8.18736 13.9959 8.18763 13.996 8.1879 13.9959C8.18938 13.9957 8.19096 13.9958 8.19245 13.9956C8.19434 13.9953 8.19614 13.9947 8.19804 13.9944C8.19916 13.9942 8.2002 13.9938 8.20133 13.9936C8.20182 13.9935 8.20227 13.9933 8.20277 13.9933C8.20628 13.9926 8.20966 13.9915 8.21318 13.9908C8.22178 13.9889 8.23043 13.987 8.23886 13.9845C8.23945 13.9844 8.24003 13.9843 8.24062 13.9841C8.24229 13.9837 8.244 13.9834 8.24567 13.9829C8.24616 13.9828 8.2467 13.9827 8.2472 13.9826C8.2485 13.9822 8.24977 13.9816 8.25103 13.9812C8.25202 13.9808 8.25292 13.9803 8.25391 13.98C8.25418 13.9799 8.25441 13.9798 8.25468 13.9797C8.26108 13.9774 8.26711 13.9745 8.27338 13.9719C8.27919 13.9695 8.28514 13.9674 8.29081 13.9647C8.29221 13.964 8.2937 13.9636 8.29505 13.963C8.29559 13.9627 8.29622 13.9625 8.29676 13.9623C8.29753 13.9619 8.29834 13.9617 8.29911 13.9613C8.30014 13.9607 8.30113 13.9601 8.30213 13.9596C8.30213 13.9596 8.30217 13.9596 8.30217 13.9596C8.30384 13.9587 8.30532 13.9575 8.30699 13.9566C8.31862 13.9504 8.32988 13.9435 8.34074 13.9361C8.3416 13.9355 8.34259 13.9351 8.34349 13.9344C8.34372 13.9342 8.34399 13.9342 8.34421 13.934C8.34525 13.9332 8.34646 13.9327 8.3475 13.932L15.3961 8.85581C15.7171 8.62434 15.8503 8.21701 15.7276 7.84216ZM12.6943 0.893202L14.0767 5.11205H11.312L12.6943 0.893202ZM13.8346 5.82544L13.2705 6.54187L9.11023 11.8261L11.0782 5.8254H13.8346V5.82544ZM7.79371 13.7537C7.79371 13.7536 7.79371 13.7536 7.79371 13.7537C7.79407 13.7547 7.79466 13.7557 7.79502 13.7568C7.79466 13.7557 7.79407 13.7547 7.79371 13.7537ZM7.16255 11.8264L2.44079 5.82544H5.19739L7.16255 11.8264ZM3.57851 0.893157L4.96339 5.11205H2.19868L3.57851 0.893157ZM1.29991 8.27888C1.2316 8.22961 1.2033 8.14264 1.22948 8.06282L1.83622 6.21705L6.28199 11.8672L1.29991 8.27888ZM7.91199 13.9226C7.9106 13.9215 7.90925 13.9203 7.90789 13.9191C7.90762 13.9189 7.90735 13.9186 7.90704 13.9183C7.90433 13.9161 7.90168 13.9138 7.89906 13.9115C7.89392 13.9071 7.88888 13.9026 7.88406 13.8978C7.88446 13.8982 7.88491 13.8985 7.88532 13.8989C7.88586 13.8994 7.88645 13.8998 7.88699 13.9003C7.89731 13.91 7.90816 13.9192 7.91952 13.9277C7.91965 13.9278 7.91974 13.928 7.91988 13.928C7.92042 13.9284 7.92087 13.9289 7.92141 13.9294C7.91826 13.9271 7.91501 13.925 7.91199 13.9226ZM8.13612 12.4889L6.97975 8.95779L5.95395 5.82544H10.3215L8.13612 12.4889ZM8.37278 13.9115C8.37008 13.9138 8.36746 13.9161 8.36471 13.9183C8.3644 13.9186 8.36408 13.9189 8.36377 13.9192C8.36237 13.9203 8.36106 13.9215 8.35971 13.9226C8.35674 13.925 8.35349 13.9271 8.35039 13.9294C8.35093 13.929 8.35138 13.9285 8.35196 13.9281C8.35205 13.928 8.35214 13.9279 8.35223 13.9279C8.36359 13.9194 8.3744 13.9103 8.38463 13.9005C8.38504 13.9001 8.38553 13.8998 8.38594 13.8994C8.38648 13.8989 8.38706 13.8985 8.38756 13.898C8.38278 13.9027 8.37783 13.9071 8.37278 13.9115ZM14.973 8.27879L9.99161 11.8661L14.4388 6.21749L15.0431 8.06246C15.0694 8.14264 15.0411 8.22965 14.973 8.27879Z"
        fill="#999999"
      />
    </svg>
  ),
  Bitbucket: (
    <svg
      width="16"
      height="12"
      viewBox="0 0 14 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0.933091 3.55629e-05C0.87069 -0.000769244 0.808871 0.0120947 0.751971 0.0377245C0.695072 0.0633542 0.644473 0.101128 0.603726 0.148395C0.562979 0.195661 0.533072 0.251274 0.516106 0.311328C0.499139 0.371383 0.495524 0.434424 0.505514 0.496024L2.32058 11.5147C2.34319 11.6495 2.41259 11.7721 2.51659 11.8608C2.62059 11.9496 2.75254 11.9988 2.88925 12H11.5968C11.6993 12.0013 11.7989 11.9657 11.8774 11.8998C11.9558 11.8339 12.008 11.742 12.0244 11.6408L13.8395 0.498162C13.8495 0.436562 13.8459 0.373521 13.8289 0.313466C13.8119 0.253412 13.782 0.197799 13.7413 0.150533C13.7005 0.103266 13.6499 0.0654922 13.593 0.0398624C13.5361 0.0142327 13.4743 0.00136858 13.4119 0.00217339L0.933091 3.55629e-05ZM8.57602 7.96364H5.79677L5.04424 4.03208H9.24945L8.57602 7.96364Z"
        fill="#999999"
      />
    </svg>
  ),
};
