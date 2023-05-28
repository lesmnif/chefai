import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/24/outline'
import Loader from './Loader'
import { toast } from 'react-hot-toast'
function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function ModalRecipes({ open, setOpen }) {
  const language = 'es-ES'

  const handleModalClose = () => {
    // Do nothing when called
  }

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={handleModalClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                <div>
                  <div className="mx-auto flex items-center justify-center">
                    <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900 text-center">
                      Generating a cool recipe, hang on!
                    </Dialog.Title>
                  </div>
                  <div className="mt-3 text-center sm:mt-5 ">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-1">
                      <div className="text-center flex justify-center">
                        <Loader />{' '}
                      </div>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
