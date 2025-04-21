"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight, Wine } from "lucide-react"

const quizQuestions = [
  {
    id: "flavor",
    question: "What flavors do you typically enjoy?",
    description: "Select the flavor profile that most appeals to you",
    options: [
      { id: "sweet", label: "Sweet", description: "Dessert wines, sweet Rieslings" },
      { id: "dry", label: "Dry", description: "Crisp whites, tannic reds" },
      { id: "fruity", label: "Fruity", description: "Fruit-forward wines with berry notes" },
      { id: "earthy", label: "Earthy", description: "Mineral, mushroom, forest floor notes" },
      { id: "spicy", label: "Spicy", description: "Peppery, cinnamon, clove notes" },
    ],
    type: "radio",
  },
  {
    id: "body",
    question: "What body type do you prefer in wines?",
    description: "Body refers to how the wine feels in your mouth",
    options: [
      { id: "light", label: "Light-bodied", description: "Delicate and refreshing like Pinot Grigio" },
      { id: "medium", label: "Medium-bodied", description: "Balanced like Merlot or Chardonnay" },
      { id: "full", label: "Full-bodied", description: "Rich and powerful like Cabernet Sauvignon" },
    ],
    type: "radio",
  },
  {
    id: "aromas",
    question: "Which aromas interest you most?",
    description: "Select all that appeal to you",
    options: [
      { id: "floral", label: "Floral", description: "Rose, violet, lavender" },
      { id: "citrus", label: "Citrus", description: "Lemon, lime, grapefruit" },
      { id: "berry", label: "Berry", description: "Strawberry, raspberry, blackberry" },
      { id: "oak", label: "Oak/Vanilla", description: "Vanilla, toast, cedar" },
      { id: "herbal", label: "Herbal/Grassy", description: "Herbs, grass, eucalyptus" },
    ],
    type: "checkbox",
  },
  {
    id: "texture",
    question: "What texture do you prefer?",
    description: "How do you like wine to feel on your palate?",
    options: [
      { id: "crisp", label: "Crisp and refreshing", description: "High acidity, clean finish" },
      { id: "smooth", label: "Smooth and velvety", description: "Round mouthfeel, soft tannins" },
      { id: "tannic", label: "Structured with tannins", description: "Firm, gripping sensation" },
    ],
    type: "radio",
  },
  {
    id: "dietary",
    question: "Do you have any dietary preferences?",
    description: "Select all that apply to you",
    options: [
      { id: "vegan", label: "Vegan wines only", description: "No animal products in fining process" },
      { id: "organic", label: "Organic wines preferred", description: "Certified organic viticulture" },
      { id: "sulfite", label: "Low sulfite wines", description: "Minimal added sulfites" },
      { id: "none", label: "No restrictions", description: "All wine styles are fine" },
    ],
    type: "checkbox",
  },
]

export default function TasteProfileQuiz() {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({})
  const [progress, setProgress] = useState(0)
  const [direction, setDirection] = useState<"forward" | "backward">("forward")

  const question = quizQuestions[currentQuestion]
  const isLastQuestion = currentQuestion === quizQuestions.length - 1
  const isFirstQuestion = currentQuestion === 0

  const handleSingleAnswer = (value: string) => {
    setAnswers({ ...answers, [question.id]: value })
  }

  const handleMultipleAnswers = (value: string, checked: boolean) => {
    const currentAnswers = (answers[question.id] as string[]) || []
    let newAnswers: string[]

    if (checked) {
      newAnswers = [...currentAnswers, value]
    } else {
      newAnswers = currentAnswers.filter((item) => item !== value)
    }

    setAnswers({ ...answers, [question.id]: newAnswers })
  }

  const handleNext = () => {
    if (isLastQuestion) {
      // Submit answers and navigate to results
      router.push("/recommendations")
    } else {
      setDirection("forward")
      setCurrentQuestion(currentQuestion + 1)
      setProgress(((currentQuestion + 1) / quizQuestions.length) * 100)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setDirection("backward")
      setCurrentQuestion(currentQuestion - 1)
      setProgress(((currentQuestion - 1) / quizQuestions.length) * 100)
    }
  }

  const isNextDisabled = () => {
    const currentAnswer = answers[question.id]
    if (!currentAnswer) return true
    if (question.type === "checkbox" && Array.isArray(currentAnswer)) {
      return currentAnswer.length === 0
    }
    return false
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8 text-center">
        <Progress value={progress} className="h-1 mb-2" />
        <p className="text-sm text-muted-foreground">
          Question {currentQuestion + 1} of {quizQuestions.length}
        </p>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: direction === "forward" ? 20 : -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction === "forward" ? -20 : 20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="premium-card border-wine-200 dark:border-wine-800">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 rounded-full bg-wine-100 dark:bg-wine-900 flex items-center justify-center">
                  <Wine className="h-6 w-6 text-wine-500" />
                </div>
              </div>
              <CardTitle className="text-2xl text-center text-gradient">{question.question}</CardTitle>
              <CardDescription className="text-center">{question.description}</CardDescription>
            </CardHeader>
            <CardContent className="pb-6">
              {question.type === "radio" ? (
                <RadioGroup
                  value={(answers[question.id] as string) || ""}
                  onValueChange={handleSingleAnswer}
                  className="space-y-4"
                >
                  {question.options.map((option) => (
                    <div
                      key={option.id}
                      className="flex items-start space-x-3 rounded-lg border border-border p-4 transition-all hover:border-wine-200 dark:hover:border-wine-800"
                    >
                      <RadioGroupItem value={option.id} id={option.id} className="mt-1" />
                      <div className="flex-1">
                        <Label htmlFor={option.id} className="text-base font-medium cursor-pointer">
                          {option.label}
                        </Label>
                        <p className="text-sm text-muted-foreground">{option.description}</p>
                      </div>
                    </div>
                  ))}
                </RadioGroup>
              ) : (
                <div className="space-y-4">
                  {question.options.map((option) => {
                    const currentAnswers = (answers[question.id] as string[]) || []
                    const isChecked = currentAnswers.includes(option.id)

                    return (
                      <div
                        key={option.id}
                        className={`flex items-start space-x-3 rounded-lg border p-4 transition-all ${
                          isChecked
                            ? "border-wine-500 bg-wine-50/50 dark:bg-wine-900/20"
                            : "border-border hover:border-wine-200 dark:hover:border-wine-800"
                        }`}
                      >
                        <Checkbox
                          id={option.id}
                          checked={isChecked}
                          onCheckedChange={(checked) => handleMultipleAnswers(option.id, checked as boolean)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <Label htmlFor={option.id} className="text-base font-medium cursor-pointer">
                            {option.label}
                          </Label>
                          <p className="text-sm text-muted-foreground">{option.description}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between pt-2 border-t">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={isFirstQuestion}
                className="rounded-full border-wine-200 dark:border-wine-800"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              <Button onClick={handleNext} disabled={isNextDisabled()} className="premium-button">
                {isLastQuestion ? "Get Recommendations" : "Next"}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
