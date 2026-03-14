import { describe, expect, it } from "vitest";
import { getDomainKey, getHostname, normalizeDomainInput } from "./domain";

describe("getHostname", () => {
  it("extracts hostname from a valid URL", () => {
    expect(getHostname("https://example.com/checkout")).toBe("example.com");
  });

  it("strips www prefix", () => {
    expect(getHostname("https://www.example.com/path")).toBe("example.com");
  });

  it("returns empty string for invalid URL", () => {
    expect(getHostname("not-a-url")).toBe("");
  });

  it("handles trailing dots", () => {
    expect(getHostname("https://example.com./page")).toBe("example.com");
  });
});

describe("normalizeDomainInput", () => {
  it("normalizes a bare domain", () => {
    expect(normalizeDomainInput("Example.COM")).toBe("example.com");
  });

  it("strips www and trailing dots", () => {
    expect(normalizeDomainInput("www.example.com.")).toBe("example.com");
  });

  it("handles a full URL", () => {
    expect(normalizeDomainInput("https://www.example.com/path?q=1")).toBe("example.com");
  });

  it("strips port numbers", () => {
    expect(normalizeDomainInput("localhost:3000")).toBe("localhost");
  });

  it("returns empty for empty input", () => {
    expect(normalizeDomainInput("")).toBe("");
    expect(normalizeDomainInput("  ")).toBe("");
  });
});

describe("getDomainKey", () => {
  it("returns the registrable domain for a subdomain", () => {
    expect(getDomainKey("app.example.com")).toBe("example.com");
  });

  it("returns as-is for a two-part domain", () => {
    expect(getDomainKey("example.com")).toBe("example.com");
  });

  it("handles multi-part public suffixes like co.uk", () => {
    expect(getDomainKey("shop.example.co.uk")).toBe("example.co.uk");
  });

  it("returns as-is for IP addresses", () => {
    expect(getDomainKey("192.168.1.1")).toBe("192.168.1.1");
  });

  it("returns as-is for localhost", () => {
    expect(getDomainKey("localhost")).toBe("localhost");
  });

  it("handles deep subdomains", () => {
    expect(getDomainKey("a.b.c.example.com")).toBe("example.com");
  });
});
