import { Image, useDisclosure, Button } from "@chakra-ui/react"
import { useRouter } from "next/router"
import { FC } from "react"
import { ModalPost } from "app/components/ModalPost"

type Props = {
  id: string
  postFileId: string
  postPrompt: string | null
  postAnnotationAdult: string | null
  postAnnotationMedical: string | null
  postAnnotationRacy: string | null
  postAnnotationSpoof: string | null
  postAnnotationViolence: string | null
  postLabels: [string, number][]
  postColors: string[]
  postWebColors: string[]
  userId: string
  userName: string
  userAvatarImageURL: string | null
  isEditable: boolean
}

export const CardPost: FC<Props> = (props) => {
  const router = useRouter()

  const { isOpen, onOpen, onClose } = useDisclosure()

  const onOpenUser = () => {
    onClose()
    router.push(`/${props.userId}`)
  }

  const onLinkColor = (color: string) => {
    onClose()
    router.push(`/colors/${color.replace("#", "")}`)
  }

  const onLinkLabel = (label: string) => {
    onClose()
    router.push(`/labels/${label}`)
  }

  return (
    <>
      <Button
        display={"block"}
        key={props.id}
        h={"auto"}
        colorScheme={isOpen ? "blue" : "gray"}
        p={1}
        onClick={onOpen}
      >
        <Image
          w={"100%"}
          alt={""}
          src={`/api/images/${props.postFileId}?w=512`}
          borderRadius={4}
        />
      </Button>
      <ModalPost
        postId={props.id}
        postFileId={props.postFileId}
        postPrompt={props.postPrompt}
        postAnnotationAdult={props.postAnnotationAdult}
        postAnnotationMedical={props.postAnnotationMedical}
        postAnnotationRacy={props.postAnnotationRacy}
        postAnnotationSpoof={props.postAnnotationSpoof}
        postAnnotationViolence={props.postAnnotationViolence}
        postLabels={props.postLabels}
        postColors={props.postColors}
        postWebColors={props.postWebColors}
        userId={props.userId}
        userName={props.userName}
        userAvatarImageURL={props.userAvatarImageURL}
        onOpenUser={onOpenUser}
        isOpen={isOpen}
        isEditable={props.isEditable}
        onOpen={onOpen}
        onClose={onClose}
        onLinkColor={onLinkColor}
        onLinkLabel={onLinkLabel}
      />
    </>
  )
}
