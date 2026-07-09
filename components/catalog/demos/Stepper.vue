<template>
  <Stepper value="1" style="width: 100%">
    <StepList>
      <Step value="1">Design</Step>
      <Step value="2">Prototype</Step>
      <Step value="3">Ship</Step>
    </StepList>
    <StepPanels>
      <StepPanel v-slot="{ activateCallback }" value="1">
        <p>Sketch your screens in the canvas.</p>
        <Button label="Next" icon="pi pi-arrow-right" icon-pos="right" @click="activateCallback('2')" />
      </StepPanel>
      <StepPanel v-slot="{ activateCallback }" value="2">
        <p>Wire up interactions and play the flow.</p>
        <div class="flex gap-2">
          <Button label="Back" severity="secondary" @click="activateCallback('1')" />
          <Button label="Next" icon="pi pi-arrow-right" icon-pos="right" @click="activateCallback('3')" />
        </div>
      </StepPanel>
      <StepPanel v-slot="{ activateCallback }" value="3">
        <p>Share the prototype link with your team.</p>
        <Button label="Back" severity="secondary" @click="activateCallback('2')" />
      </StepPanel>
    </StepPanels>
  </Stepper>
</template>
