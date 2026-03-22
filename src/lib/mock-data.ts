import type { Problem, UserProfile, MistakePattern, Submission, LearningPathNode, Boss, SkillNode, StreakActivity } from './types';

export const PROBLEMS: Problem[] = [
  { id: '1', title: 'Two Sum', difficulty: 'Easy', tags: ['Array', 'Hash Table'], acceptance: 49.2, description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.', examples: [{ input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].' }], constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9'], starterCode: { python: 'def twoSum(nums, target):\n    # Your code here\n    pass', javascript: 'function twoSum(nums, target) {\n    // Your code here\n}', cpp: 'vector<int> twoSum(vector<int>& nums, int target) {\n    // Your code here\n}' }, aiPriority: 'High', aiReason: 'You failed 3 similar problems involving hash maps', status: 'unsolved' },
  { id: '2', title: 'Reverse Linked List', difficulty: 'Easy', tags: ['Linked List', 'Recursion'], acceptance: 72.5, description: 'Given the head of a singly linked list, reverse the list, and return the reversed list.', examples: [{ input: 'head = [1,2,3,4,5]', output: '[5,4,3,2,1]', explanation: 'The list is reversed.' }], constraints: ['0 <= Number of nodes <= 5000'], starterCode: { python: 'def reverseList(head):\n    pass', javascript: 'function reverseList(head) {\n    \n}', cpp: 'ListNode* reverseList(ListNode* head) {\n    \n}' }, aiPriority: null, aiReason: '', status: 'solved' },
  { id: '3', title: 'Binary Search', difficulty: 'Easy', tags: ['Array', 'Binary Search'], acceptance: 54.3, description: 'Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums.', examples: [{ input: 'nums = [-1,0,3,5,9,12], target = 9', output: '4', explanation: '9 exists in nums and its index is 4.' }], constraints: ['1 <= nums.length <= 10^4'], starterCode: { python: 'def search(nums, target):\n    pass', javascript: 'function search(nums, target) {\n    \n}', cpp: 'int search(vector<int>& nums, int target) {\n    \n}' }, aiPriority: 'High', aiReason: 'Off-by-one errors detected in 4 binary search attempts', status: 'attempted' },
  { id: '4', title: 'Valid Parentheses', difficulty: 'Easy', tags: ['String', 'Stack'], acceptance: 40.1, description: 'Given a string s containing just the characters \'(\', \')\', \'{\', \'}\', \'[\' and \']\', determine if the input string is valid.', examples: [{ input: 's = "()"', output: 'true', explanation: 'The string has matching brackets.' }], constraints: ['1 <= s.length <= 10^4'], starterCode: { python: 'def isValid(s):\n    pass', javascript: 'function isValid(s) {\n    \n}', cpp: 'bool isValid(string s) {\n    \n}' }, aiPriority: 'Medium', aiReason: 'Stack-based problems are a weak area', status: 'unsolved' },
  { id: '5', title: 'Merge Two Sorted Lists', difficulty: 'Easy', tags: ['Linked List', 'Recursion'], acceptance: 60.8, description: 'You are given the heads of two sorted linked lists list1 and list2. Merge the two lists into one sorted list.', examples: [{ input: 'list1 = [1,2,4], list2 = [1,3,4]', output: '[1,1,2,3,4,4]', explanation: 'Merged in sorted order.' }], constraints: ['0 <= Number of nodes <= 50'], starterCode: { python: 'def mergeTwoLists(l1, l2):\n    pass', javascript: 'function mergeTwoLists(l1, l2) {\n    \n}', cpp: 'ListNode* mergeTwoLists(ListNode* l1, ListNode* l2) {\n    \n}' }, aiPriority: null, aiReason: '', status: 'solved' },
  { id: '6', title: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', tags: ['Hash Table', 'String', 'Sliding Window'], acceptance: 33.8, description: 'Given a string s, find the length of the longest substring without repeating characters.', examples: [{ input: 's = "abcabcbb"', output: '3', explanation: 'The answer is "abc", with the length of 3.' }], constraints: ['0 <= s.length <= 5 * 10^4'], starterCode: { python: 'def lengthOfLongestSubstring(s):\n    pass', javascript: 'function lengthOfLongestSubstring(s) {\n    \n}', cpp: 'int lengthOfLongestSubstring(string s) {\n    \n}' }, aiPriority: 'High', aiReason: 'Sliding window is your #1 mistake pattern', status: 'attempted' },
  { id: '7', title: 'Container With Most Water', difficulty: 'Medium', tags: ['Array', 'Two Pointers', 'Greedy'], acceptance: 54.0, description: 'You are given an integer array height of length n. Find two lines that together with the x-axis form a container, such that the container contains the most water.', examples: [{ input: 'height = [1,8,6,2,5,4,8,3,7]', output: '49', explanation: 'The max area is between index 1 and 8.' }], constraints: ['n == height.length', '2 <= n <= 10^5'], starterCode: { python: 'def maxArea(height):\n    pass', javascript: 'function maxArea(height) {\n    \n}', cpp: 'int maxArea(vector<int>& height) {\n    \n}' }, aiPriority: 'Medium', aiReason: 'Two pointer technique needs practice', status: 'unsolved' },
  { id: '8', title: '3Sum', difficulty: 'Medium', tags: ['Array', 'Two Pointers', 'Sorting'], acceptance: 32.2, description: 'Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.', examples: [{ input: 'nums = [-1,0,1,2,-1,-4]', output: '[[-1,-1,2],[-1,0,1]]', explanation: 'The distinct triplets are shown.' }], constraints: ['3 <= nums.length <= 3000'], starterCode: { python: 'def threeSum(nums):\n    pass', javascript: 'function threeSum(nums) {\n    \n}', cpp: 'vector<vector<int>> threeSum(vector<int>& nums) {\n    \n}' }, aiPriority: null, aiReason: '', status: 'unsolved' },
  { id: '9', title: 'Coin Change', difficulty: 'Medium', tags: ['Array', 'Dynamic Programming', 'BFS'], acceptance: 41.5, description: 'You are given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money. Return the fewest number of coins needed.', examples: [{ input: 'coins = [1,5,11], amount = 11', output: '3', explanation: '11 = 5 + 5 + 1' }], constraints: ['1 <= coins.length <= 12'], starterCode: { python: 'def coinChange(coins, amount):\n    pass', javascript: 'function coinChange(coins, amount) {\n    \n}', cpp: 'int coinChange(vector<int>& coins, int amount) {\n    \n}' }, aiPriority: 'High', aiReason: 'DP state transitions are a recurring mistake', status: 'attempted' },
  { id: '10', title: 'Number of Islands', difficulty: 'Medium', tags: ['Array', 'DFS', 'BFS', 'Graph'], acceptance: 56.2, description: 'Given an m x n 2D binary grid which represents a map of "1"s (land) and "0"s (water), return the number of islands.', examples: [{ input: 'grid = [["1","1","0"],["1","1","0"],["0","0","1"]]', output: '2', explanation: 'Two distinct islands.' }], constraints: ['m == grid.length', '1 <= m, n <= 300'], starterCode: { python: 'def numIslands(grid):\n    pass', javascript: 'function numIslands(grid) {\n    \n}', cpp: 'int numIslands(vector<vector<char>>& grid) {\n    \n}' }, aiPriority: null, aiReason: '', status: 'solved' },
  { id: '11', title: 'Merge Intervals', difficulty: 'Medium', tags: ['Array', 'Sorting'], acceptance: 46.1, description: 'Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals.', examples: [{ input: 'intervals = [[1,3],[2,6],[8,10],[15,18]]', output: '[[1,6],[8,10],[15,18]]', explanation: 'Intervals [1,3] and [2,6] overlap.' }], constraints: ['1 <= intervals.length <= 10^4'], starterCode: { python: 'def merge(intervals):\n    pass', javascript: 'function merge(intervals) {\n    \n}', cpp: 'vector<vector<int>> merge(vector<vector<int>>& intervals) {\n    \n}' }, aiPriority: 'Medium', aiReason: 'Sorting-based approaches need reinforcement', status: 'unsolved' },
  { id: '12', title: 'LRU Cache', difficulty: 'Medium', tags: ['Hash Table', 'Linked List', 'Design'], acceptance: 40.5, description: 'Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.', examples: [{ input: 'LRUCache(2), put(1,1), put(2,2), get(1)', output: '1', explanation: 'Cache returns value for key 1.' }], constraints: ['1 <= capacity <= 3000'], starterCode: { python: 'class LRUCache:\n    def __init__(self, capacity):\n        pass', javascript: 'class LRUCache {\n    constructor(capacity) {\n        \n    }\n}', cpp: 'class LRUCache {\npublic:\n    LRUCache(int capacity) {\n        \n    }\n};' }, aiPriority: null, aiReason: '', status: 'unsolved' },
  { id: '13', title: 'Word Break', difficulty: 'Medium', tags: ['Hash Table', 'String', 'Dynamic Programming'], acceptance: 45.3, description: 'Given a string s and a dictionary of strings wordDict, return true if s can be segmented into a space-separated sequence of one or more dictionary words.', examples: [{ input: 's = "leetcode", wordDict = ["leet","code"]', output: 'true', explanation: '"leetcode" can be segmented as "leet code".' }], constraints: ['1 <= s.length <= 300'], starterCode: { python: 'def wordBreak(s, wordDict):\n    pass', javascript: 'function wordBreak(s, wordDict) {\n    \n}', cpp: 'bool wordBreak(string s, vector<string>& wordDict) {\n    \n}' }, aiPriority: 'High', aiReason: 'String DP is a major weak area for you', status: 'attempted' },
  { id: '14', title: 'Trapping Rain Water', difficulty: 'Hard', tags: ['Array', 'Two Pointers', 'Dynamic Programming', 'Stack'], acceptance: 58.7, description: 'Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.', examples: [{ input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]', output: '6', explanation: '6 units of rain water are trapped.' }], constraints: ['n == height.length', '1 <= n <= 2 * 10^4'], starterCode: { python: 'def trap(height):\n    pass', javascript: 'function trap(height) {\n    \n}', cpp: 'int trap(vector<int>& height) {\n    \n}' }, aiPriority: null, aiReason: '', status: 'unsolved' },
  { id: '15', title: 'Median of Two Sorted Arrays', difficulty: 'Hard', tags: ['Array', 'Binary Search', 'Divide and Conquer'], acceptance: 36.1, description: 'Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.', examples: [{ input: 'nums1 = [1,3], nums2 = [2]', output: '2.0', explanation: 'merged = [1,2,3] and median is 2.' }], constraints: ['nums1.length == m', 'nums2.length == n'], starterCode: { python: 'def findMedianSortedArrays(nums1, nums2):\n    pass', javascript: 'function findMedianSortedArrays(nums1, nums2) {\n    \n}', cpp: 'double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {\n    \n}' }, aiPriority: 'High', aiReason: 'Binary search edge cases are your Achilles heel', status: 'unsolved' },
  { id: '16', title: 'Serialize and Deserialize Binary Tree', difficulty: 'Hard', tags: ['String', 'Tree', 'DFS', 'BFS', 'Design'], acceptance: 54.7, description: 'Design an algorithm to serialize and deserialize a binary tree.', examples: [{ input: 'root = [1,2,3,null,null,4,5]', output: '[1,2,3,null,null,4,5]', explanation: 'Tree is serialized and deserialized correctly.' }], constraints: ['0 <= Number of nodes <= 10^4'], starterCode: { python: 'class Codec:\n    def serialize(self, root):\n        pass\n    def deserialize(self, data):\n        pass', javascript: 'class Codec {\n    serialize(root) {}\n    deserialize(data) {}\n}', cpp: 'class Codec {\npublic:\n    string serialize(TreeNode* root) {}\n    TreeNode* deserialize(string data) {}\n};' }, aiPriority: null, aiReason: '', status: 'unsolved' },
  { id: '17', title: 'Minimum Window Substring', difficulty: 'Hard', tags: ['Hash Table', 'String', 'Sliding Window'], acceptance: 40.4, description: 'Given two strings s and t of lengths m and n respectively, return the minimum window substring of s such that every character in t is included in the window.', examples: [{ input: 's = "ADOBECODEBANC", t = "ABC"', output: '"BANC"', explanation: 'The minimum window substring is "BANC".' }], constraints: ['1 <= s.length, t.length <= 10^5'], starterCode: { python: 'def minWindow(s, t):\n    pass', javascript: 'function minWindow(s, t) {\n    \n}', cpp: 'string minWindow(string s, string t) {\n    \n}' }, aiPriority: 'High', aiReason: 'Advanced sliding window: you struggle with shrinking the window', status: 'attempted' },
  { id: '18', title: 'Course Schedule', difficulty: 'Medium', tags: ['DFS', 'BFS', 'Graph', 'Topological Sort'], acceptance: 45.6, description: 'There are a total of numCourses courses you have to take. Some courses may have prerequisites. Determine if you can finish all courses.', examples: [{ input: 'numCourses = 2, prerequisites = [[1,0]]', output: 'true', explanation: 'You can take course 0 then course 1.' }], constraints: ['1 <= numCourses <= 2000'], starterCode: { python: 'def canFinish(numCourses, prerequisites):\n    pass', javascript: 'function canFinish(numCourses, prerequisites) {\n    \n}', cpp: 'bool canFinish(int numCourses, vector<vector<int>>& prerequisites) {\n    \n}' }, aiPriority: null, aiReason: '', status: 'solved' },
  { id: '19', title: 'Implement Trie', difficulty: 'Medium', tags: ['Hash Table', 'String', 'Design', 'Trie'], acceptance: 62.0, description: 'A trie or prefix tree is a tree data structure used to efficiently store and retrieve keys in a dataset of strings.', examples: [{ input: 'Trie(), insert("apple"), search("apple")', output: 'true', explanation: 'apple was inserted and found.' }], constraints: ['1 <= word.length <= 2000'], starterCode: { python: 'class Trie:\n    def __init__(self):\n        pass', javascript: 'class Trie {\n    constructor() {}\n}', cpp: 'class Trie {\npublic:\n    Trie() {}\n};' }, aiPriority: 'Medium', aiReason: 'Data structure design needs more reps', status: 'unsolved' },
  { id: '20', title: 'Maximum Subarray', difficulty: 'Medium', tags: ['Array', 'Divide and Conquer', 'Dynamic Programming'], acceptance: 50.0, description: 'Given an integer array nums, find the subarray with the largest sum, and return its sum.', examples: [{ input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', output: '6', explanation: 'The subarray [4,-1,2,1] has the largest sum 6.' }], constraints: ['1 <= nums.length <= 10^5'], starterCode: { python: 'def maxSubArray(nums):\n    pass', javascript: 'function maxSubArray(nums) {\n    \n}', cpp: 'int maxSubArray(vector<int>& nums) {\n    \n}' }, aiPriority: null, aiReason: '', status: 'solved' },
];

export const USER_PROFILE: UserProfile = {
  id: 'user-1',
  username: 'alexcoder',
  email: 'alex@codemind.dev',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alexcoder',
  streak: 14,
  xp: 3240,
  level: 'Intermediate',
  languages: [
    { name: 'Python', proficiency: 78 },
    { name: 'JavaScript', proficiency: 65 },
    { name: 'C++', proficiency: 42 },
    { name: 'SQL', proficiency: 30 },
    { name: 'Go', proficiency: 15 },
  ],
  solvedCount: 47,
  totalAttempts: 89,
};

export const MISTAKE_PATTERNS: MistakePattern[] = [
  { id: 'mp-1', name: 'Off-by-one in Binary Search', frequency: 12, lastSeen: '2026-03-15', trend: [3, 2, 4, 1, 3, 2, 1, 0], relatedProblems: ['3', '15'], severity: 'high' },
  { id: 'mp-2', name: 'Sliding Window Shrink Logic', frequency: 9, lastSeen: '2026-03-14', trend: [1, 2, 3, 2, 1, 2, 1, 1], relatedProblems: ['6', '17'], severity: 'high' },
  { id: 'mp-3', name: 'DP State Transition Errors', frequency: 7, lastSeen: '2026-03-13', trend: [2, 1, 1, 2, 1, 0, 1, 1], relatedProblems: ['9', '13'], severity: 'medium' },
  { id: 'mp-4', name: 'Forgetting Edge Cases (null/empty)', frequency: 6, lastSeen: '2026-03-12', trend: [1, 1, 2, 0, 1, 1, 0, 1], relatedProblems: ['2', '5'], severity: 'medium' },
  { id: 'mp-5', name: 'Two Pointer Direction Logic', frequency: 4, lastSeen: '2026-03-10', trend: [0, 1, 1, 0, 1, 0, 1, 0], relatedProblems: ['7', '14'], severity: 'low' },
  { id: 'mp-6', name: 'Hash Map Key Collision Handling', frequency: 3, lastSeen: '2026-03-08', trend: [1, 0, 0, 1, 0, 0, 1, 0], relatedProblems: ['1', '8'], severity: 'low' },
];

export const SUBMISSIONS: Submission[] = [
  { id: 's-1', problemId: '1', problemTitle: 'Two Sum', verdict: 'Wrong Answer', runtime: '45ms', memory: '42.1MB', language: 'Python', timestamp: '2026-03-17T10:30:00Z', code: 'def twoSum(nums, target):\n    for i in range(len(nums)):\n        for j in range(len(nums)):\n            if nums[i]+nums[j]==target:\n                return [i,j]' },
  { id: 's-2', problemId: '3', problemTitle: 'Binary Search', verdict: 'Wrong Answer', runtime: '12ms', memory: '38.5MB', language: 'JavaScript', timestamp: '2026-03-17T09:15:00Z', code: 'function search(nums, target) {\n    let l=0, r=nums.length;\n    while(l<r){\n        let m=Math.floor((l+r)/2);\n        if(nums[m]===target) return m;\n        if(nums[m]<target) l=m;\n        else r=m;\n    }\n    return -1;\n}' },
  { id: 's-3', problemId: '6', problemTitle: 'Longest Substring Without Repeating Characters', verdict: 'Time Limit Exceeded', runtime: '-', memory: '-', language: 'Python', timestamp: '2026-03-16T22:00:00Z', code: 'def lengthOfLongestSubstring(s):\n    ...' },
  { id: 's-4', problemId: '2', problemTitle: 'Reverse Linked List', verdict: 'Accepted', runtime: '8ms', memory: '36.2MB', language: 'Python', timestamp: '2026-03-16T20:30:00Z', code: '...' },
  { id: 's-5', problemId: '10', problemTitle: 'Number of Islands', verdict: 'Accepted', runtime: '120ms', memory: '45.3MB', language: 'JavaScript', timestamp: '2026-03-16T18:00:00Z', code: '...' },
  { id: 's-6', problemId: '5', problemTitle: 'Merge Two Sorted Lists', verdict: 'Accepted', runtime: '14ms', memory: '38.0MB', language: 'Python', timestamp: '2026-03-15T15:00:00Z', code: '...' },
  { id: 's-7', problemId: '9', problemTitle: 'Coin Change', verdict: 'Wrong Answer', runtime: '30ms', memory: '40.0MB', language: 'JavaScript', timestamp: '2026-03-15T12:00:00Z', code: '...' },
  { id: 's-8', problemId: '18', problemTitle: 'Course Schedule', verdict: 'Accepted', runtime: '55ms', memory: '42.8MB', language: 'Python', timestamp: '2026-03-14T19:00:00Z', code: '...' },
  { id: 's-9', problemId: '20', problemTitle: 'Maximum Subarray', verdict: 'Accepted', runtime: '18ms', memory: '37.5MB', language: 'C++', timestamp: '2026-03-14T16:00:00Z', code: '...' },
  { id: 's-10', problemId: '17', problemTitle: 'Minimum Window Substring', verdict: 'Wrong Answer', runtime: '80ms', memory: '44.0MB', language: 'Python', timestamp: '2026-03-13T21:00:00Z', code: '...' },
  { id: 's-11', problemId: '13', problemTitle: 'Word Break', verdict: 'Runtime Error', runtime: '-', memory: '-', language: 'JavaScript', timestamp: '2026-03-13T18:00:00Z', code: '...' },
  { id: 's-12', problemId: '4', problemTitle: 'Valid Parentheses', verdict: 'Wrong Answer', runtime: '5ms', memory: '35.0MB', language: 'Python', timestamp: '2026-03-12T14:00:00Z', code: '...' },
  { id: 's-13', problemId: '7', problemTitle: 'Container With Most Water', verdict: 'Accepted', runtime: '65ms', memory: '41.0MB', language: 'JavaScript', timestamp: '2026-03-11T10:00:00Z', code: '...' },
  { id: 's-14', problemId: '11', problemTitle: 'Merge Intervals', verdict: 'Wrong Answer', runtime: '25ms', memory: '39.5MB', language: 'Python', timestamp: '2026-03-10T20:00:00Z', code: '...' },
  { id: 's-15', problemId: '15', problemTitle: 'Median of Two Sorted Arrays', verdict: 'Time Limit Exceeded', runtime: '-', memory: '-', language: 'C++', timestamp: '2026-03-09T17:00:00Z', code: '...' },
];

export const LEARNING_PATH_NODES: LearningPathNode[] = [
  { id: 'lp-1', title: 'Arrays & Hashing', status: 'completed', problemIds: ['1', '20'], x: 50, y: 10, connections: ['lp-2', 'lp-3'] },
  { id: 'lp-2', title: 'Two Pointers', status: 'completed', problemIds: ['7', '8'], x: 25, y: 22, connections: ['lp-4'] },
  { id: 'lp-3', title: 'Stack', status: 'completed', problemIds: ['4'], x: 75, y: 22, connections: ['lp-5'] },
  { id: 'lp-4', title: 'Binary Search', status: 'current', problemIds: ['3', '15'], x: 20, y: 34, connections: ['lp-6'] },
  { id: 'lp-5', title: 'Sliding Window', status: 'current', problemIds: ['6', '17'], x: 80, y: 34, connections: ['lp-7'] },
  { id: 'lp-6', title: 'Linked List', status: 'locked', problemIds: ['2', '5'], x: 30, y: 46, connections: ['lp-8'] },
  { id: 'lp-7', title: 'Trees', status: 'locked', problemIds: ['16'], x: 70, y: 46, connections: ['lp-8'] },
  { id: 'lp-8', title: 'Tries', status: 'locked', problemIds: ['19'], x: 50, y: 58, connections: ['lp-9', 'lp-10'] },
  { id: 'lp-9', title: 'Graphs', status: 'locked', problemIds: ['10', '18'], x: 30, y: 70, connections: ['lp-11'] },
  { id: 'lp-10', title: 'Dynamic Programming', status: 'locked', problemIds: ['9', '13'], x: 70, y: 70, connections: ['lp-12'] },
  { id: 'lp-11', title: 'Backtracking', status: 'locked', problemIds: [], x: 25, y: 82, connections: ['lp-13'] },
  { id: 'lp-12', title: 'Greedy', status: 'locked', problemIds: ['11'], x: 75, y: 82, connections: ['lp-13'] },
  { id: 'lp-13', title: 'Intervals', status: 'locked', problemIds: ['14'], x: 50, y: 90, connections: ['lp-14'] },
  { id: 'lp-14', title: 'Advanced Patterns', status: 'locked', problemIds: ['12'], x: 50, y: 98, connections: [] },
];

export const AI_COACH_RESPONSES: string[] = [
  "I see you've been struggling with off-by-one errors in binary search. Remember: when using `left <= right`, your mid calculation and boundary updates need to be consistent. Try using `left = mid + 1` and `right = mid - 1` to avoid infinite loops.",
  "Looking at your history, sliding window problems trip you up when shrinking the window. The key insight: always ask 'when should I shrink?' before coding. Write the shrink condition FIRST.",
  "Your DP solutions often miss the base case. Before writing the transition, enumerate ALL base cases on paper. For this problem, what happens when the input is empty? When it has one element?",
  "I noticed you tend to use brute force first and then get stuck optimizing. Try thinking about the problem constraints — if n is 10^5, you need O(n log n) or better. What data structure gives you O(log n) lookups?",
  "Great question! For this problem, think about what information you need at each step. If you're comparing elements, a hash map gives O(1) lookup. If you need ordering, consider a balanced BST or sorted array with binary search.",
  "You've made this exact mistake before — forgetting to handle the null/empty case. I've added a reminder to your learning profile. Always start with: 'What if the input is null? Empty? Has one element?'",
  "Looking at your submission history, you solve problems faster in Python but make fewer errors in JavaScript. Consider solving in Python first for speed, then translating to JS for accuracy practice.",
  "This problem is similar to 'Two Sum' which you solved correctly. The difference is the sorted input — that means you can use two pointers instead of a hash map for O(1) space. Try starting from both ends.",
  "I've analyzed your last 10 submissions: 60% of your errors come in the first 5 minutes. Try spending 3 minutes planning before writing any code. What's the input? Output? Edge cases?",
  "Pattern detected! You're about to hit your most common mistake: incorrect boundary conditions. Before submitting, trace through your solution with the smallest possible input.",
];

export const BOSS_DATA: Boss = {
  name: 'The Graph Dragon',
  description: 'A legendary dynamic-programming + graph beast. The community must collectively submit 500 accepted solutions before time runs out.',
  difficulty: 'Hard',
  hp: 500,
  hpRemaining: 312,
  timeLeft: { days: 4, hours: 11, minutes: 28 },
  rewards: ['500 XP', 'Boss Slayer Badge', '3 Freeze Cards'],
  topContributors: [
    { rank: 1, username: 'algo_wizard', hits: 24, avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=wizard' },
    { rank: 2, username: 'codebreaker99', hits: 19, avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=codebreaker' },
    { rank: 3, username: 'bytehunter', hits: 15, avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=bytehunter' },
    { rank: 4, username: 'recursive_rose', hits: 11, avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=rose' },
    { rank: 5, username: 'you', hits: 7, avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=you', isYou: true },
  ],
  problem: {
    id: 'boss-week-12',
    title: 'Shortest Path in Weighted DAG with Constraints',
    tags: ['Graph', 'Dynamic Programming', 'Topological Sort'],
  },
};

export const SKILL_TREE_DATA: SkillNode[] = [
  { id: 'arrays', title: 'Arrays & Strings', icon: 'Package', status: 'mastered', xpRequired: 300, xpEarned: 300, prerequisites: [], problemCount: 20, description: 'Master the basics of arrays, strings and two-pointer techniques.', tier: 0 },
  { id: 'hashmaps', title: 'Hash Maps & Sets', icon: 'Folder', status: 'mastered', xpRequired: 250, xpEarned: 250, prerequisites: [], problemCount: 15, description: 'Key-value lookups and set operations for O(1) answers.', tier: 0 },
  { id: 'linked-list', title: 'Linked Lists', icon: 'Link', status: 'in-progress', xpRequired: 350, xpEarned: 210, prerequisites: ['arrays'], problemCount: 18, description: 'Singly, doubly, and circular linked lists with pointer manipulation.', tier: 1 },
  { id: 'stacks-queues', title: 'Stacks & Queues', icon: 'BookOpen', status: 'available', xpRequired: 300, xpEarned: 0, prerequisites: ['arrays'], problemCount: 16, description: 'LIFO/FIFO patterns, monotonic stacks, and sliding windows.', tier: 1 },
  { id: 'binary-search', title: 'Binary Search', icon: 'Search', status: 'available', xpRequired: 280, xpEarned: 0, prerequisites: ['arrays'], problemCount: 14, description: 'Search in O(log n) — sorted arrays, rotated arrays, answer-space.', tier: 1 },
  { id: 'trees', title: 'Binary Trees', icon: 'TreePalm', status: 'locked', xpRequired: 400, xpEarned: 0, prerequisites: ['linked-list', 'stacks-queues'], problemCount: 22, description: 'Tree traversals, height, diameter, and path problems.', tier: 2 },
  { id: 'bst', title: 'Binary Search Trees', icon: 'Trees', status: 'locked', xpRequired: 380, xpEarned: 0, prerequisites: ['trees', 'binary-search'], problemCount: 18, description: 'BST invariant, insertion, deletion, and balanced BSTs.', tier: 2 },
  { id: 'graphs', title: 'Graphs & BFS/DFS', icon: 'Network', status: 'locked', xpRequired: 500, xpEarned: 0, prerequisites: ['trees'], problemCount: 25, description: 'BFS, DFS, topological sort, union-find, shortest paths.', tier: 3 },
  { id: 'heap', title: 'Heaps & Priority Queues', icon: 'Hammer', status: 'locked', xpRequired: 420, xpEarned: 0, prerequisites: ['trees'], problemCount: 16, description: 'Min/max heaps, K-th element, merge K sorted lists.', tier: 3 },
  { id: 'dp', title: 'Dynamic Programming', icon: 'Puzzle', status: 'locked', xpRequired: 600, xpEarned: 0, prerequisites: ['graphs', 'heap'], problemCount: 30, description: 'Memoization, tabulation, classic DP patterns.', tier: 4 },
];

export const STREAK_ACTIVITY: StreakActivity[] = Array.from({ length: 35 }).map((_, i) => {
  const d = new Date('2026-03-19');
  d.setDate(d.getDate() - (34 - i));
  const isFrozen = i === 18 || i === 12; // Adjusted indices to match previous logic roughly
  const solved = isFrozen ? 0 : Math.floor(Math.random() * 4);
  return { date: d.toISOString().split('T')[0], solved, frozen: isFrozen };
});
