"use client";

import { ErrorMessage } from "@/components/common/message";
import { MESSAGES } from "@/constants/common/messages";

const TermsAndConditionPageError = () => {
  return <ErrorMessage errorMessages={MESSAGES.ERROR_UNEXPECTED} />;
};

export default TermsAndConditionPageError;
