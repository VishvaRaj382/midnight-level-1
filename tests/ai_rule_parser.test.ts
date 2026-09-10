import { describe, it, expect } from "vitest";
import { parseNaturalLanguageRequirement, validateStructuredRule } from "../src/utils/aiRuleParser.js";

describe("AI Rule Parser & Schema Validation Suite", () => {
  it("parses standard natural language requirement into structured schema", () => {
    const prompt = "I need applicants earning at least fifty thousand rupees per month (50000 INR).";
    const res = parseNaturalLanguageRequirement(prompt);

    expect(res.isValid).toBe(true);
    expect(res.rule).toBeDefined();
    expect(res.rule?.metric).toBe("monthly_income");
    expect(res.rule?.operator).toBe(">=");
    expect(res.rule?.threshold).toBe(50000);
    expect(res.rule?.currency).toBe("INR");
  });

  it("parses shorthand expressions (e.g., 'salary at least 75k inr')", () => {
    const res = parseNaturalLanguageRequirement("salary at least 75k inr");
    expect(res.isValid).toBe(true);
    expect(res.rule?.threshold).toBe(75000);
    expect(res.rule?.currency).toBe("INR");
  });

  it("parses lakh notations (e.g., 'annual income minimum 12 lakh INR')", () => {
    const res = parseNaturalLanguageRequirement("annual income minimum 12 lakh INR");
    expect(res.isValid).toBe(true);
    expect(res.rule?.metric).toBe("annual_income");
    expect(res.rule?.threshold).toBe(1200000);
  });

  it("validates valid structured rules", () => {
    const validRule = {
      metric: "monthly_income",
      operator: ">=",
      threshold: 50000,
      currency: "INR",
    };
    const res = validateStructuredRule(validRule);
    expect(res.isValid).toBe(true);
    expect(res.rule).toEqual(expect.objectContaining(validRule));
  });

  it("rejects unsupported metrics", () => {
    const invalidRule = {
      metric: "arbitrary_unsupported_metric",
      operator: ">=",
      threshold: 50000,
      currency: "INR",
    };
    const res = validateStructuredRule(invalidRule);
    expect(res.isValid).toBe(false);
    expect(res.error).toContain("Unsupported metric");
  });

  it("rejects unsupported operators", () => {
    const invalidRule = {
      metric: "monthly_income",
      operator: "!=",
      threshold: 50000,
      currency: "INR",
    };
    const res = validateStructuredRule(invalidRule);
    expect(res.isValid).toBe(false);
    expect(res.error).toContain("Unsupported operator");
  });

  it("rejects non-positive or invalid thresholds", () => {
    const zeroRule = {
      metric: "monthly_income",
      operator: ">=",
      threshold: 0,
      currency: "INR",
    };
    const negRule = {
      metric: "monthly_income",
      operator: ">=",
      threshold: -500,
      currency: "INR",
    };
    expect(validateStructuredRule(zeroRule).isValid).toBe(false);
    expect(validateStructuredRule(negRule).isValid).toBe(false);
  });

  it("rejects empty or gibberish prompts without numbers", () => {
    const res = parseNaturalLanguageRequirement("just some random text without numbers");
    expect(res.isValid).toBe(false);
    expect(res.error).toBeDefined();
  });
});
