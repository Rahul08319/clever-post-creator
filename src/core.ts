/**
 * TypeSafe Intelligence Core Module
 *
 * Implements TypeSafe System One patterns (Jev model conventions),
 * tool categorization primitives, context compaction scoring, and
 * structured question instructions following TypeSafe's latest prompting guidelines.
 */

export interface TypeSafeQuestion<TCriteria = unknown> {
  id: string; // Question ID for software/orchestration (not sent to the model)
  instructions: string; // Coherent, single-dimension judgment instructions
  criteria: TCriteria; // Concrete, distinguishable levels or choices
  contextPath?: string; // Reference path into structured application state
}

/**
 * Mutually exclusive Choice primitive definition
 */
export interface ChoicePrimitive {
  type: "choice";
  options: Array<{
    value: string;
    description: string;
  }>;
}

/**
 * Binary probability condition primitive (Noul)
 */
export interface NoulPrimitive {
  type: "noul";
  condition: string;
}

/**
 * Ordered dimension scoring primitive (Score)
 */
export interface ScorePrimitive {
  type: "score";
  levels: Array<{
    score: number;
    description: string;
  }>;
}

/**
 * Tool categorization schema for context compaction.
 *
 * Evaluation:
 * A strict `Choice` primitive provides clean partitioning when tools fall into
 * mutually exclusive domains. However, for context compaction where tools may serve
 * multiple functions (e.g., both state retrieval and execution), TypeSafe best practice
 * pairs coarse-grained Choice routing with a graded `Score` primitive or independent `Noul`
 * conditions to preserve compaction recall without pruning borderline tools.
 */
export const ToolCategoryChoice: ChoicePrimitive = {
  type: "choice",
  options: [
    {
      value: "data_retrieval",
      description: "Tools that search, fetch, read, or query external state or documents without side effects."
    },
    {
      value: "state_mutation",
      description: "Tools that modify, write, delete, or alter application data, records, or files."
    },
    {
      value: "execution_runtime",
      description: "Tools that run code, execute shell commands, deploy builds, or control background processes."
    },
    {
      value: "communication_delivery",
      description: "Tools that post messages, notify users, or dispatch external communications."
    },
    {
      value: "hybrid_or_other",
      description: "Tools spanning multiple categories or not clearly matching a single exclusive domain."
    }
  ]
};

/**
 * Question instructions for Tool Compaction Relevance.
 * Adheres strictly to TypeSafe Prompting Best Practices:
 * 1. Independent, coherent single judgment.
 * 2. Backticked state paths (`task.goal`, `tool.spec`).
 * 3. Observable, concrete criteria levels without vague intensifiers.
 * 4. Explicit fallback level.
 */
export const ToolCompactionRelevanceQuestion: TypeSafeQuestion<ScorePrimitive> = {
  id: "tool_compaction_relevance",
  instructions:
    "Evaluate whether the tool defined in `tool.definition` is directly required to fulfill the user's active goal in `session.current_goal`.",
  contextPath: "session.current_goal",
  criteria: {
    type: "score",
    levels: [
      {
        score: 0,
        description: "The tool is completely unrelated to the active goal and can be safely omitted from context."
      },
      {
        score: 1,
        description: "The tool relates to an adjacent capability but is not strictly necessary for the immediate step."
      },
      {
        score: 2,
        description: "The tool is plausible as an auxiliary or fallback mechanism for the current task."
      },
      {
        score: 3,
        description: "The tool is indispensably needed to execute the user's primary requested action."
      }
    ]
  }
};

/**
 * Dynamic Multi-Year Engine Utilities
 * Automatically handles temporal calculations for current and upcoming years.
 */
export class TemporalEngine {
  static getCurrentYear(): number {
    return new Date().getFullYear();
  }

  static getRoadmapYears(count = 5): number[] {
    const startYear = this.getCurrentYear();
    return Array.from({ length: count }, (_, i) => startYear + i);
  }

  static formatRelativeTime(date: Date = new Date()): string {
    const year = date.getFullYear();
    const month = date.toLocaleString("en-US", { month: "short" });
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;

    return `${month} ${day}, ${year} at ${formattedHours}:${minutes} ${ampm}`;
  }

  static getTrendingTopicsForYear(year: number = this.getCurrentYear()): string[] {
    const baseTopics = [
      "Autonomous Agent Swarms",
      "Neuromorphic Architecture",
      "Post-Quantum Cryptography",
      "React 19 Server Actions",
      "Distributed Vector Databases",
      "Zero-Knowledge Proofs",
      "Edge WebAssembly Runtimes",
      "Multi-Modal Reasoning LLMs",
      "Liquid Neural Networks",
      "Spatial Computing & VisionOS"
    ];

    if (year >= 2027) {
      return [
        "Quantum Supremacy Algorithms",
        "Bio-Computing & DNA Storage",
        "Autonomous Self-Healing Software",
        ...baseTopics.slice(0, 7)
      ];
    }
    return baseTopics;
  }
}
