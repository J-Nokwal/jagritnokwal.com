import React from 'react'

type Props = {}

const Page = (props: Props) => {
  return (
    <div className="tooltip tooltip-right h-20 flex justify-center content-center" data-tip="Flutter with BLoC, Provider, etc.">
    <img src="https://img.shields.io/badge/Flutter-02569B?style=for-the-badge&logo=flutter&logoColor=white" alt="Flutter" className="w-24 h-8 rounded-md" />
  </div>  )
}

export default Page